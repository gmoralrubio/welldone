import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Newsreader } from 'next/font/google';
import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { resolveLocale } from '@/i18n/locale-utils';
import { routing } from '@/i18n/routing';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-jakarta-sans',
  subsets: ['latin'],
});

const newsreader = Newsreader({
  variable: '--font-newsreader',
  subsets: ['latin'],
});

// Genera parámetros estaticos
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale: paramLocale } = await params;
  const locale = resolveLocale(paramLocale);
  const t = await getTranslations({ locale, namespace: 'AppMetadata' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function RootLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale: paramLocale } = await params;
  const locale = resolveLocale(paramLocale);

  return (
    <html
      lang={locale}
      className={`${plusJakartaSans.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="flex flex-1 flex-col bg-background text-foreground">
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
