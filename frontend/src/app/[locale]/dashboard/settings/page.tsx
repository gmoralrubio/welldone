import { cookies } from 'next/headers';
import { getLocale, getTranslations } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import AccountForm from './account-form';
import DeleteAccount from './delete-account';

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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <header className="border-b border-separator pb-4">
          <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
            {t('settingsTitle')}
          </h1>
        </header>
        <section className="flex w-full justify-center">
          <div className="flex w-full max-w-xl flex-col gap-8">
            <AccountForm
              user={{
                name: user.name,
                surname: user.surname,
                username: user.username,
                email: user.email,
              }}
            />

            <DeleteAccount />
          </div>
        </section>
      </div>

      <aside className="hidden lg:block lg:w-80 lg:shrink-0" />
    </div>
  );
}
