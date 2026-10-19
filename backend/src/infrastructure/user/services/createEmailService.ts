import { EmailService } from '@domain/user/services/EmailService';
import { environmentService } from '@infrastructure/shared/services/EnvironmentService';

import { NodemailerEmailService } from './NodeMailerEmailService';
import { ResendEmailService } from './ResendEmailService';

export function createEmailService(): EmailService {
  const env = environmentService.get();

  if (env.NODE_ENV === 'production') {
    if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
      throw new Error('Resend configuration is missing');
    }

    return new ResendEmailService(env.RESEND_API_KEY, env.RESEND_FROM_EMAIL);
  }

  return new NodemailerEmailService();
}
