import { EntityNotFoundError } from "../../errors/EntityNotFoundError";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { UserRepository } from "../repositories/UserRepository";
import { SecurityService } from "../services/SecurityService";

export interface LoginUserUseCaseInput {
  identifier: string;
  password: string;
}

export class LoginUserUseCase {
  private readonly userRepository: UserRepository;
  private readonly securityService: SecurityService;

  constructor(
    userRepository: UserRepository,
    securityService: SecurityService,
  ) {
    this.userRepository = userRepository;
    this.securityService = securityService;
  }

  async execute(input: LoginUserUseCaseInput) {
    // 1. Compruebas email o username
    const userByEmail = await this.userRepository.findByEmail(input.identifier);
    const user =
      userByEmail ??
      (await this.userRepository.findByUsername(input.identifier));
    //2. Si el usuario no existe lanzas un error:
    if (!user) {
      throw new EntityNotFoundError("User", input.identifier);
    }
    // Compruebas la contraseña comparando la que tienes
    // en el input con la del email que ha puesto
    // Resultado un boolean
    const passwordComparison = await this.securityService.comparePassword(
      input.password,
      user.password,
    );
    // Si no coinciden lanzas error:
    if (!passwordComparison) {
      throw new UnauthorizedError("Wrong password");
    }

    const token = this.securityService.generateJWT(user.id);
    return token;
  }
}
