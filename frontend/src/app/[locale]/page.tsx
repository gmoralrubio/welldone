import { redirect } from '@/i18n/navigation';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';

export default async function Home({ params }: PageProps<'/[locale]'>) {
  const { locale: paramLocale } = await params;
  const locale = hasLocale(routing.locales, paramLocale)
    ? paramLocale
    : routing.defaultLocale;
  redirect({ href: '/articles', locale });
}
