import { getLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { getCurrentUser } from '@/lib/auth/get-current-user';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const user = await getCurrentUser();

  if (!user) {
    redirect({ href: '/login', locale });
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col bg-background">
      <div className="mx-auto flex w-full max-w-[1088px] flex-1 flex-col px-8 py-8">
        {children}
      </div>
    </main>
  );
}
