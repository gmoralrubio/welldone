import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Newsreader } from 'next/font/google';
import './globals.css';
import { NextIntlClientProvider } from 'next-intl';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-jakarta-sans',
  subsets: ['latin'],
});

const newsreader = Newsreader({
  variable: '--font-newsreader',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Welldone',
  description: 'Proyecto final de Bootcamp Keep Coding Web 20',
};

export default function RootLayout({ children }: LayoutProps<'/[locale]'>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="flex flex-1 flex-col bg-background text-foreground">
          {/* Provider next-intl para Client components */}
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
