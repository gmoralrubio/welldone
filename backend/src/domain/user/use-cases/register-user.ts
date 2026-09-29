import { BadSyntaxError } from "../../errors/BadSyntaxError";
import { BusinessConflictError } from "../../errors/BusinessConflictError";
import { ValidationError } from "../../errors/ValidationError";
import { UserRepository } from "../repositories/UserRepository";
import { SecurityService } from "../services/SecurityService";
import { User } from "../User";

export interface CreateUserUseCaseInput {
  email: string;
  password: string;
  name: string;
  surname: string;
  username: string;
}

export class CreateUserUseCase {
  private readonly userRepository: UserRepository;
  private readonly securityService: SecurityService;

  constructor(
    userRepository: UserRepository,
    securityService: SecurityService,
  ) {
    this.userRepository = userRepository;
    this.securityService = securityService;
  }

  async execute(input: CreateUserUseCaseInput): Promise<User> {
    // 1. Compruebas que el email no existía
    const existingEmail = await this.userRepository.findByEmail(input.email);
    const existingUsername = await this.userRepository.findByUsername(
      input.username,
    );

    if (existingEmail) {
      throw new BusinessConflictError("Email already in use");
    }
    if (existingUsername) {
      throw new BusinessConflictError("Username already in use");
    }
    // 2. Validas contraseña
    this.validatePassword(input.password);
    // 3. Validas email
    this.validateEmail(input.email);
    // 4. Validas que rellenen name y surname
    if (!input.name) {
      throw new ValidationError("Name is required");
    }
    if (!input.surname) {
      throw new ValidationError("Surname is required");
    }
    // 5. Hasheas contraseña
    const hashedPassword = await this.securityService.hash(input.password);
    // 6. Guardas usuario
    // Sustituyes la password original por la hasheada
    const newUser = await this.userRepository.create({
      ...input,
      password: hashedPassword,
    });
    return newUser;
  }

  // MÉTODOS PRIVADO(PROPIOS) DEL CASO DE USO:
  // Método de validación de la password
  private validatePassword(password: string) {
    // Expresión regular para validar la password
    const validPasswordRegEx = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,15}$/,
    );
    // Testeo de que la password cumple
    // la expresión regular y por lo tanto es válida
    if (!validPasswordRegEx.test(password)) {
      throw new BadSyntaxError(
        "Invalid password syntax, password is not strong enough",
      );
    }
  }

  // Método de validación del email
  private validateEmail(email: string) {
    // Expresión regular para validar el email
    const validEmailRegEx = new RegExp(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    );
    // Testeo de que el email cumple
    // la expresión regular y por lo tanto es válido
    if (!validEmailRegEx.test(email)) {
      throw new BadSyntaxError("Invalid email syntax");
    }
  }
}
