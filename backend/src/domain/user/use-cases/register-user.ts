import { BusinessConflictError } from '../../errors/BusinessConflictError';
import { ValidationError } from '../../errors/ValidationError';
import { UserRepository } from '../repositories/UserRepository';
import { SecurityService } from '../services/SecurityService';
import { validatePassword } from '../validators/validate-password';
import { validateEmail } from '../validators/validate-email';
import { validateUsername } from '../validators/validate-username';
import { User } from '../User';

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

  constructor(userRepository: UserRepository, securityService: SecurityService) {
    this.userRepository = userRepository;
    this.securityService = securityService;
  }

  async execute(input: CreateUserUseCaseInput): Promise<User> {
    // 1. Validas que rellenen name y surname
    if (!input.name) {
      throw new ValidationError('Name is required');
    }
    if (!input.surname) {
      throw new ValidationError('Surname is required');
    }
    // 2. Validas formato nombre de usuario
    validateUsername(input.username);

    // 3. Validas formato contraseña
    validatePassword(input.password);

    // 4. Validas formato email
    validateEmail(input.email);

    // 5. Compruebas que el email y el usuario no existía
    const existingEmail = await this.userRepository.findByEmail(input.email);
    const existingUsername = await this.userRepository.findByUsername(input.username);

    if (existingEmail) {
      throw new BusinessConflictError('Email already in use', 'email');
    }
    if (existingUsername) {
      throw new BusinessConflictError('Username already in use', 'username');
    }

    // 6. Hasheas contraseña
    const hashedPassword = await this.securityService.hash(input.password);

    // 7. Sustituyes la password original por la hasheada
    const newUser = await this.userRepository.create({
      ...input,
      password: hashedPassword,
    });

    // 8. Guardas usuario
    return newUser;
  }
}
