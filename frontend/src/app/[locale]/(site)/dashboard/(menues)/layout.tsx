import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { SidebarMenu } from '@/app/[locale]/components/dashboard/sidebar-menu';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return redirect({ href: '/login', locale });
  }

  const response = await fetch(`${process.env.API_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (response.status === 401 || !response.ok) {
    return redirect({ href: '/login', locale });
  }

  const user = await response.json();

  return (
    <div className="flex flex-1 flex-col bg-background">
      <div className="flex flex-1">
        <aside className="w-64 border-r border-separator bg-background-secondary p-6">
          <SidebarMenu username={user.username} />
        </aside>

        <main className="min-w-0 flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}