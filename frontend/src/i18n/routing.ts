import { DEFAULT_LOCALE, LOCALES } from '@/i18n/locales';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Lista de locales permitidos
  locales: LOCALES,

  defaultLocale: DEFAULT_LOCALE,
});
