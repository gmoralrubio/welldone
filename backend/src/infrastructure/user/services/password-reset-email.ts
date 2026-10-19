import { EmailLocale } from '@domain/user/services/EmailService';

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

export function getPasswordResetEmail(
  resetUrl: string,
  locale: EmailLocale
): { subject: string; text: string } {
  const translations = emailTranslations[locale];

  return {
    subject: translations.subject,
    text: `${translations.greeting}

${translations.instructions}

${resetUrl}

${translations.expiration}

${translations.disclaimer}`,
  };
}
