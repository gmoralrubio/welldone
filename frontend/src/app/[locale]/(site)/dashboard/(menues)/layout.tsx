import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';

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

  if (!response.ok) {
    return redirect({ href: '/login', locale });
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col bg-background">
      <div className="mx-auto flex w-full max-w-[1088px] flex-1 flex-col px-8 py-8">
        {children}
      </div>
    </main>
  );
}
