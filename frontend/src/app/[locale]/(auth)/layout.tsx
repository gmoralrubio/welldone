import AuthHeader from '@/app/[locale]/components/auth/auth-header';
import { SiteFooter } from '@/app/[locale]/components/shared/site-footer';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f6] text-[#1a1c1a] antialiased">
      <AuthHeader />

      <main className="flex flex-1 flex-col">{children}</main>

      <SiteFooter />
    </div>
  );
}
