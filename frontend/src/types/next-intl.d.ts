import messages from '../../messages/es.json';
import type { AppLocale } from '@/i18n/locale-utils';

// Tipa locales y mensajes
declare module 'next-intl' {
  interface AppConfig {
    Locale: AppLocale;
    Messages: typeof messages;
  }
}
