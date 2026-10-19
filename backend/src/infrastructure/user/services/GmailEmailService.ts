import nodemailer from 'nodemailer';

import { EmailService, EmailLocale } from '@domain/user/services/EmailService';
import { getPasswordResetEmail } from './password-reset-email';

type GmailSmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
};

export class GmailEmailService implements EmailService {
  private readonly transporter: nodemailer.Transporter;
  private readonly fromEmail: string;

  constructor(config: GmailSmtpConfig) {
    this.fromEmail = config.from;
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
  }

  async sendPasswordResetEmail(
    email: string,
    resetUrl: string,
    locale: EmailLocale
  ): Promise<void> {
    const { subject, text } = getPasswordResetEmail(resetUrl, locale);

    await this.transporter.sendMail({
      from: this.fromEmail,
      to: email,
      subject,
      text,
    });
  }
}
