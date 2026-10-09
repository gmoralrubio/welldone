import { cookies } from 'next/headers';
import { getLocale, getTranslations } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import AccountForm from './account-form';

interface UserProfile {
  id: number;
  name: string;
  surname: string;
  username: string;
  email: string;
}

export default async function AccountPage() {
  const t = await getTranslations('Dashboard');
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

  if (response.status === 401) {
    return redirect({ href: '/login', locale });
  }

  if (!response.ok) {
    throw new Error('Could not load user profile');
  }

  const user: UserProfile = await response.json();
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('accountTitle')}</h1>
      </div>

      <AccountForm
        user={{
          name: user.name,
          surname: user.surname,
          username: user.username,
          email: user.email,
        }}
      />
    </section>
  );
}
