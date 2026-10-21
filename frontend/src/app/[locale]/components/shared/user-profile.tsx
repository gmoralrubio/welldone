'use client';

import { Dropdown } from '@heroui/react';
import { ChevronDown } from '@gravity-ui/icons';
import { Link } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { logout } from '@/app/[locale]/logout/logout-action';
import { UserAvatar } from '@/app/[locale]/components/user/user-avatar';

type UserProfileProps = {
  name: string;
  surname: string;
  username: string;
};

const UserProfile = ({ name, surname, username }: UserProfileProps) => {
  const locale = useLocale();
  const t = useTranslations('SiteHeader');

  return (
    <Dropdown>
      <Dropdown.Trigger
        className="flex items-center gap-1.5 rounded-full bg-black/5 py-1 pl-1 pr-4 transition-colors hover:bg-black/10"
        aria-label={t('accountAria')}
      >
        <UserAvatar
          name={name}
          surname={surname}
          username={username}
          size="sm"
          className="size-8 shrink-0"
        />

        <span className="hidden max-w-40 truncate px-1 text-xs font-bold text-foreground sm:inline">
          @{username}
        </span>

        <ChevronDown
          width={8}
          height={8}
        />
      </Dropdown.Trigger>

      <Dropdown.Popover>
        <Dropdown.Menu aria-label={t('accountAria')}>
          <Dropdown.Item
            id="account"
            textValue={t('profile')}
          >
            <Link
              href={`/dashboard/@${username}`}
              className="block w-full no-underline text-inherit"
            >
              {t('profile')}
            </Link>
          </Dropdown.Item>

          <Dropdown.Item
            id="logout"
            textValue={t('logout')}
          >
            <form action={logout.bind(null, locale)}>
              <button
                type="submit"
                className="w-full text-left"
              >
                {t('logout')}
              </button>
            </form>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};

export default UserProfile;
