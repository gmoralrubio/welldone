import { Resend } from 'resend';

import { EmailService, EmailLocale } from '@domain/user/services/EmailService';
import { getPasswordResetEmail } from './password-reset-email';

export class ResendEmailService implements EmailService {
  private readonly resend: Resend;
  private readonly fromEmail: string;

  constructor(apiKey: string, fromEmail: string) {
    this.resend = new Resend(apiKey);
    this.fromEmail = fromEmail;
  }

  async sendPasswordResetEmail(
    email: string,
    resetUrl: string,
    locale: EmailLocale
  ): Promise<void> {
    const { subject, text } = getPasswordResetEmail(resetUrl, locale);

    const { error } = await this.resend.emails.send({
      from: this.fromEmail,
      to: email,
      subject,
      text,
    });

    if (error) {
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }
  }
}
