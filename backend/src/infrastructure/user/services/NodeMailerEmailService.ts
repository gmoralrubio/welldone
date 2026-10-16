import nodemailer from 'nodemailer';
import { EmailService, EmailLocale } from '@domain/user/services/EmailService';
import { environmentService } from '@infrastructure/shared/services/EnvironmentService';

const emailTranslations = {
  es: {
    subject: 'Recuperación de contraseña - WellDone',
    greeting: 'Has solicitado restablecer tu contraseña.',
    instructions: 'Accede al siguiente enlace para establecer una nueva contraseña:',
    expiration: 'Este enlace caducará en 30 minutos.',
    disclaimer: 'Si no has solicitado este cambio, puedes ignorar este correo.',
  },
  en: {
    subject: 'Password reset - WellDone',
    greeting: 'You have requested to reset your password.',
    instructions: 'Use the following link to set a new password:',
    expiration: 'This link will expire in 30 minutes.',
    disclaimer: 'If you did not request this change, you can ignore this email.',
  },
};

export class NodemailerEmailService implements EmailService {
  async sendPasswordResetEmail(
    email: string,
    resetUrl: string,
    locale: EmailLocale
  ): Promise<void> {
    const { MAILDEV_HOST, MAILDEV_PORT } = environmentService.get();

    if (!MAILDEV_HOST || !MAILDEV_PORT) {
      throw new Error('MailDev configuration is missing');
    }

    const transporter = nodemailer.createTransport({
      host: MAILDEV_HOST,
      port: Number(MAILDEV_PORT),
      secure: false,
    });

    const translations = emailTranslations[locale];

    await transporter.sendMail({
      from: '"WellDone" <no-reply@welldone.local>',
      to: email,
      subject: translations.subject,
      text: `${translations.greeting}

${translations.instructions}

${resetUrl}

${translations.expiration}

${translations.disclaimer}`,
    });
  }
}
