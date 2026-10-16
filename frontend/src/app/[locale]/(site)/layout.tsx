import { SiteHeader } from '@/app/[locale]/components/shared/site-header';
import { SiteFooter } from '@/app/[locale]/components/shared/site-footer';

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader
        search=""
        order="desc"
      />

      <div className="flex flex-1 flex-col">{children}</div>

      <SiteFooter />
    </div>
  );
}
