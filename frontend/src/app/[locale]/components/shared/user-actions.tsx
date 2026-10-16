'use client';

import WriteButton from './write-button';
import UserProfile from './user-profile';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

type UserActionsProps = {
  user: {
    name: string;
    username: string;
  } | null;
};

const UserActions = ({ user }: UserActionsProps) => {
  const t = useTranslations('SiteHeader');

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
      <WriteButton />
      <UserProfile
        name={user.name}
        username={user.username}
      />
    </div>
  );
};

export default UserActions;
