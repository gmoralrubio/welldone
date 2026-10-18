import { BusinessConflictError } from '../../errors/BusinessConflictError';
import { ValidationError } from '../../errors/ValidationError';
import { UserRepository } from '../repositories/UserRepository';
import { SecurityService } from '../services/SecurityService';
import { validatePassword } from '../validators/validate-password';
import { validateEmail } from '../validators/validate-email';
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
    // 1. Compruebas que el email no existía
    const existingEmail = await this.userRepository.findByEmail(input.email);
    const existingUsername = await this.userRepository.findByUsername(input.username);

    if (existingEmail) {
      throw new BusinessConflictError('Email already in use', 'email');
    }
    if (existingUsername) {
      throw new BusinessConflictError('Username already in use', 'username');
    }
    // 2. Validas contraseña
    validatePassword(input.password);
    // 3. Validas email
    validateEmail(input.email);
    // 4. Validas que rellenen name y surname
    if (!input.name) {
      throw new ValidationError('Name is required');
    }
    if (!input.surname) {
      throw new ValidationError('Surname is required');
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
}
