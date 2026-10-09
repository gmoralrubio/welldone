import { BadSyntaxError } from "../../errors/BadSyntaxError";
import { BusinessConflictError } from "../../errors/BusinessConflictError";
import { ValidationError } from "../../errors/ValidationError";
import { UpdateUserData, UserRepository } from "../repositories/UserRepository";
import { User } from "../User";

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: number, input: UpdateUserData): Promise<User> {
    // 1. Comprobar que el usuario existe
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ValidationError("User not found");
    }

    // 2. Validar el nombre, si se quiere modificar
    if (input.name !== undefined) {
      if (typeof input.name !== "string" || !input.name.trim()) {
        throw new ValidationError("Name is required");
      }
    }

    // 3. Validar los apellidos, si se quieren modificar
    if (input.surname !== undefined) {
      if (typeof input.surname !== "string" || !input.surname.trim()) {
        throw new ValidationError("Surname is required");
      }
    }

    // 4. Validar el email y comprobar si está ocupado
    if (input.email !== undefined) {
      if (typeof input.email !== "string") {
        throw new BadSyntaxError("Invalid email syntax");
      }

      const validEmailRegEx =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!validEmailRegEx.test(input.email)) {
        throw new BadSyntaxError("Invalid email syntax");
      }

      if (input.email !== user.email) {
        const existingEmail = await this.userRepository.findByEmail(
          input.email,
        );

        if (existingEmail) {
          throw new BusinessConflictError("Email already in use", "email");
        }
      }
    }

    // 5. Validar el username y comprobar si está ocupado
    if (input.username !== undefined) {
      if (typeof input.username !== "string" || !input.username.trim()) {
        throw new ValidationError("Username is required");
      }

      if (input.username !== user.username) {
        const existingUsername = await this.userRepository.findByUsername(
          input.username,
        );

        if (existingUsername) {
          throw new BusinessConflictError(
            "Username already in use",
            "username",
          );
        }
      }
    }

    // 6. Actualizar los datos
    return this.userRepository.update(userId, input);
  }
}
