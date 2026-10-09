import { cookies } from 'next/headers';
import { getLocale, getTranslations } from 'next-intl/server';
import { Link, redirect } from '@/i18n/navigation';
import { SiteHeader } from '@/app/[locale]/components/shared/site-header';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');
  const locale = await getLocale();
  const t = await getTranslations('Dashboard');

  if (!accessToken) {
    return redirect({ href: '/login', locale });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader
        search=""
        order="desc"
      />

      <div className="flex flex-1">
        <aside className="w-64 border-r border-separator bg-background-secondary p-6">
          <nav className="flex flex-col gap-2">
            <Link href="/dashboard">{t('nav.articles')}</Link>
            <Link href="/dashboard/favorites">{t('nav.favorites')}</Link>
            <Link href="/dashboard/highlights">{t('nav.highlights')}</Link>
            <Link href="/dashboard/notifications">{t('nav.notifications')}</Link>
            <Link href="/dashboard/account">{t('nav.account')}</Link>
          </nav>
        </aside>

        <main className="min-w-0 flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
