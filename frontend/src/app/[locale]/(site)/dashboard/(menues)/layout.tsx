import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { SidebarMenu } from '@/app/[locale]/components/dashboard/sidebar-menu';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');
  const locale = await getLocale();

  if (!accessToken) {
    return redirect({ href: '/login', locale });
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      {' '}
      <div className="flex flex-1">
        <aside className="w-64 border-r border-separator bg-background-secondary p-6">
          <SidebarMenu />
        </aside>

        <main className="min-w-0 flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
