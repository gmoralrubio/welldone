import { cookies } from 'next/headers';
import { redirect } from '@/i18n/navigation';
import { getLocale } from 'next-intl/server';

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    redirect({ href: '/login', locale });
  }

  return <>{children}</>;
}