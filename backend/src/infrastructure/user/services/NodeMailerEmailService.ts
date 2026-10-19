import nodemailer from 'nodemailer';
import { EmailService, EmailLocale } from '@domain/user/services/EmailService';
import { environmentService } from '@infrastructure/shared/services/EnvironmentService';
import { getPasswordResetEmail } from './password-reset-email';

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

    const { subject, text } = getPasswordResetEmail(resetUrl, locale);

    await transporter.sendMail({
      from: '"WellDone" <no-reply@welldone.local>',
      to: email,
      subject,
      text,
    });
  }
}
