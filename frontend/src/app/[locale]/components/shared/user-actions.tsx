'use client';

import WriteButton from './write-button';
import UserProfile from './user-profile';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

type UserActionsProps = {
  user: {
    name: string;
    surname: string;
    username: string;
  } | null;
};

const UserActions = ({ user }: UserActionsProps) => {
  const t = useTranslations('SiteHeader');
  const pathname = usePathname();

  const isDashboard = pathname.startsWith('/dashboard');
  const isEditorMode = pathname.includes('/create') || pathname.includes('/edit');

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-1 text-sm font-semibold text-accent-dark no-underline"
      >
        {t('signIn')} <span aria-hidden="true">→</span>
      </Link>
    );
  }
  return (
    <div className="flex items-center gap-4">
      {!isEditorMode && isDashboard && <WriteButton />}
      <UserProfile
        name={user.name}
        surname={user.surname}
        username={user.username}
      />
    </div>
  );
};

export default UserActions;
