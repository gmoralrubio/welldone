import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');

  if (!accessToken) {
    redirect('/users/login');
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 border-r border-separator bg-background-secondary p-6">
        <nav className="flex flex-col gap-2">
          <Link href="/dashboard">Mis artículos</Link>
          <Link href="/dashboard/favorites">Favoritos</Link>
          <Link href="/dashboard/highlights">Destacados</Link>
          <Link href="/dashboard/notifications">Notificaciones</Link>
          <Link href="/dashboard/account">Cuenta</Link>
        </nav>
      </aside>

      <main className="min-w-0 flex-1 p-8">{children}</main>
    </div>
  );
}
