import { cookies } from 'next/headers';

import { SiteHeader } from '@/app/[locale]/components/shared/site-header';
import { SiteFooter } from '@/app/[locale]/components/shared/site-footer';
import { UserSidebar } from '@/app/[locale]/components/shared/user-sidebar';

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  let username: string | null = null;

  if (accessToken) {
    try {
      const response = await fetch(`${process.env.API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      });

      if (response.ok) {
        const user: { username: string } = await response.json();
        username = user.username;
      }
    } catch (error) {
      console.error('Error al obtener el usuario del menú:', error);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader
        search=""
        order="desc"
      />

      <div className="relative flex flex-1 flex-col">
        {username && <UserSidebar username={username} />}
        <div className="mt-8 flex min-w-0 flex-1 flex-col min-[1360px]:mt-0">
          {children}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
