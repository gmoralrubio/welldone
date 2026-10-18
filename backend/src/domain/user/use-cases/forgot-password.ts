import { createHash, randomBytes } from 'node:crypto';
import { UserRepository } from '../repositories/UserRepository';
import { PasswordResetTokenRepository } from '../repositories/PasswordResetTokenRepository';
import { EmailLocale, EmailService } from '../services/EmailService';
import { validateEmail } from '../validators/validate-email';

interface ForgotPasswordInput {
  email: string;
  locale: EmailLocale;
}

export class ForgotPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: PasswordResetTokenRepository,
    private readonly emailService: EmailService,
    private readonly frontendUrl: string
  ) {}

  async execute({ email, locale }: ForgotPasswordInput): Promise<void> {
    // Validar el correo electrónico.
    validateEmail(email);

    // Buscar al usuario.
    const user = await this.userRepository.findByEmail(email);

    // No revelar si el correo está registrado
    if (!user) {
      return;
    }

    // Generar un token seguro
    const token = randomBytes(32).toString('hex');

    // Guardar hash
    const tokenHash = createHash('sha256').update(token).digest('hex');

    // Caducidad enlace
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    // Invalidar solicitudes anteriores
    await this.tokenRepository.deleteByUserId(user.id);

    // Guardar nuevo token
    await this.tokenRepository.create(user.id, tokenHash, expiresAt);

    // Construir el enlace de recuperación
    const resetUrl = new URL(`/${locale}/reset-password`, this.frontendUrl);
    resetUrl.searchParams.set('token', token);

    // Enviar el correo en el idioma seleccionado.
    await this.emailService.sendPasswordResetEmail(
      user.email,
      resetUrl.toString(),
      locale
    );
  }
}
