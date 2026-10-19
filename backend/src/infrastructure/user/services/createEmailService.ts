import { EmailService } from '@domain/user/services/EmailService';
import { environmentService } from '@infrastructure/shared/services/EnvironmentService';

import { GmailEmailService } from './GmailEmailService';
import { NodemailerEmailService } from './NodeMailerEmailService';

export function createEmailService(): EmailService {
  const env = environmentService.get();

  if (env.NODE_ENV === 'production') {
    if (
      !env.SMTP_HOST ||
      env.SMTP_PORT === undefined ||
      !env.SMTP_SECURE ||
      !env.SMTP_USER ||
      !env.SMTP_PASS ||
      !env.MAIL_FROM
    ) {
      throw new Error('Gmail SMTP configuration is missing');
    }

    return new GmailEmailService({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE === 'true',
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
      from: env.MAIL_FROM,
    });
  }

  return new NodemailerEmailService();
}
