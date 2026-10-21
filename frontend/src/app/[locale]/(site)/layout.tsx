import { SiteHeader } from '@/app/[locale]/components/shared/site-header';
import { SiteFooter } from '@/app/[locale]/components/shared/site-footer';
import { UserSidebar } from '@/app/[locale]/components/shared/user-sidebar';
import { getCurrentUser } from '@/lib/auth/get-current-user';

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader
        search=""
        order="desc"
      />

      <div className="relative flex flex-1 flex-col">
        {user && <UserSidebar username={user.username} />}

        <div className="mt-8 flex min-w-0 flex-1 flex-col min-[1360px]:mt-0">
          {children}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
