import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { UserRepository } from '../repositories/UserRepository';
import { SecurityService } from '../services/SecurityService';

export interface LoginUserUseCaseInput {
  identifier: string;
  password: string;
}

export class LoginUserUseCase {
  private readonly userRepository: UserRepository;
  private readonly securityService: SecurityService;

  constructor(userRepository: UserRepository, securityService: SecurityService) {
    this.userRepository = userRepository;
    this.securityService = securityService;
  }

  async execute(input: LoginUserUseCaseInput) {
    // 1. Compruebas email o username
    const userByEmail = await this.userRepository.findByEmail(input.identifier);
    const user =
      userByEmail ?? (await this.userRepository.findByUsername(input.identifier));
    //2. Si el usuario no existe lanzas un error genérico:
    if (!user) {
      throw new UnauthorizedError('Wrong user or password');
    }
    // Compruebas la contraseña comparando la que tienes
    // en el input con la del email que ha puesto
    // Resultado un boolean
    const passwordComparison = await this.securityService.comparePassword(
      input.password,
      user.password
    );
    // Error genérico
    if (!passwordComparison) {
      throw new UnauthorizedError('Wrong user or password');
    }

    const token = this.securityService.generateJWT(user.id);
    return token;
  }
}
