export type EmailLocale = 'es' | 'en';

export interface EmailService {
  sendPasswordResetEmail(
    email: string,
    resetUrl: string,
    locale: EmailLocale
  ): Promise<void>;
}
