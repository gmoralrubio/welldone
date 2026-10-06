import { hasLocale } from 'next-intl';
import { routing } from './routing';

// Tipado de los locales -> 'en' 'es'
export type AppLocale = (typeof routing.locales)[number];

// A partir de un parametro locale string, si este existe en los locales permitidos, devuelve un locale ('es, 'en') tipado. Si no, devuelve el locale por defecto
export function resolveLocale(paramLocale: string): AppLocale {
  if (hasLocale(routing.locales, paramLocale)) {
    return paramLocale;
  }
  return routing.defaultLocale;
}
