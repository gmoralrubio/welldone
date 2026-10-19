import { createHash } from 'node:crypto';
import { PasswordResetTokenRepository } from '../repositories/PasswordResetTokenRepository';
import { SecurityService } from '../services/SecurityService';
import { validatePassword } from '../validators/validate-password';
import { ValidationError } from '../../errors/ValidationError';

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export class ResetPasswordUseCase {
  private readonly passwordResetTokenRepository: PasswordResetTokenRepository;
  private readonly securityService: SecurityService;

  constructor(
    passwordResetTokenRepository: PasswordResetTokenRepository,
    securityService: SecurityService
  ) {
    this.passwordResetTokenRepository = passwordResetTokenRepository;
    this.securityService = securityService;
  }

  async execute({ token, password }: ResetPasswordInput): Promise<void> {
    // Validar la nueva contraseña.
    validatePassword(password);

    // Obtener el hash del token recibido.
    const tokenHash = createHash('sha256').update(token).digest('hex');

    // Generar el hash seguro de la contraseña.
    const hashedPassword = await this.securityService.hash(password);

    // Actualizar la contraseña e invalidar el token.
    const passwordUpdated = await this.passwordResetTokenRepository.resetPassword(
      tokenHash,
      hashedPassword
    );

    if (!passwordUpdated) {
      throw new ValidationError('Invalid or expired password reset token');
    }
  }
}
