import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { UserRepository } from '../repositories/UserRepository';
import { LoginAttemptSecurityService } from '../services/LoginAttemptSecurityService';
import { SecurityService } from '../services/SecurityService';

export interface LoginUserUseCaseInput {
  identifier: string;
  password: string;
}

export class LoginUserUseCase {
  private readonly userRepository: UserRepository;
  private readonly securityService: SecurityService;
  private readonly loginAttemptSecurityService: LoginAttemptSecurityService;

  constructor(
    userRepository: UserRepository,
    securityService: SecurityService,
    loginAttemptSecurityService: LoginAttemptSecurityService
  ) {
    this.userRepository = userRepository;
    this.securityService = securityService;
    this.loginAttemptSecurityService = loginAttemptSecurityService;
  }

  async execute(input: LoginUserUseCaseInput) {
    const userByEmail = await this.userRepository.findByEmail(input.identifier);
    const user =
      userByEmail ?? (await this.userRepository.findByUsername(input.identifier));
    if (!user) {
      throw new UnauthorizedError('Wrong user or password');
    }

    if (this.loginAttemptSecurityService.isBlocked(user.id)) {
      throw new UnauthorizedError(
        'Demasiados intentos fallidos. Vuelve a intentarlo más tarde.'
      );
    }
    const passwordComparison = await this.securityService.comparePassword(
      input.password,
      user.password
    );
    // Error genérico
    if (!passwordComparison) {
      this.loginAttemptSecurityService.registerFailure(user.id);
      throw new UnauthorizedError('Wrong user or password');
    }

    this.loginAttemptSecurityService.resetFailures(user.id);

    const token = this.securityService.generateJWT(user.id);
    return token;
  }
}
