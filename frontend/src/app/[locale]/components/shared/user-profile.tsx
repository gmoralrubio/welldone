'use client';

import { Avatar, Dropdown } from '@heroui/react';
import { ChevronDown } from '@gravity-ui/icons';
import { Link } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { logout } from '@/app/[locale]/logout/logout-action';

const UserProfile = () => {
  const locale = useLocale();
  const t = useTranslations('SiteHeader');

  return (
    <Dropdown>
      <Dropdown.Trigger
        className="flex items-center gap-1.5 bg-transparent px-1"
        aria-label={t('accountAria')}
      >
        <Avatar
          size="sm"
          className="size-8"
        >
          <Avatar.Fallback className="text-xs bg-accent-soft text-accent-soft-foreground">
            WD
          </Avatar.Fallback>
        </Avatar>
        <ChevronDown
          width={8}
          height={8}
        />
      </Dropdown.Trigger>

      <Dropdown.Popover>
        <Dropdown.Menu aria-label={t('accountAria')}>
          <Dropdown.Item
            id="account"
            textValue={t('account')}
          >
            <Link
              href="/dashboard/account"
              className="block w-full no-underline text-inherit"
            >
              {t('account')}
            </Link>
          </Dropdown.Item>
          <Dropdown.Item
            id="dashboard"
            textValue={t('dashboard')}
          >
            <Link
              href="/dashboard"
              className="block w-full no-underline text-inherit"
            >
              {t('dashboard')}
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
