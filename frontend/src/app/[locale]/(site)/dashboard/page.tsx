import { cookies } from 'next/headers';
import { redirect } from '@/i18n/navigation';
import { getLocale } from 'next-intl/server';
import { resolveLocale } from '@/i18n/locale-utils';

export default async function DashboardIndexPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const rawLocale = await getLocale();
  const locale = resolveLocale(rawLocale);

  if (!accessToken) {
    redirect({ href: '/login', locale });
  }

  const response = await fetch(`${process.env.API_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    redirect({ href: '/login', locale });
  }

  const user = await response.json();

  // Redirige automáticamente a su perfil privado
  redirect({ href: `/dashboard/@${user.username}`, locale });
}