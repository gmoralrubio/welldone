'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function SidebarMenu({ username }: { username: string }) {
  const pathname = usePathname();
  const t = useTranslations('UserNavigation');

  const menuItems = [

    { href: '/articles', label: t('home') },
    {
      href: `/dashboard/@${username}`,
      label: t('profile'),
      matchPrefix: '/dashboard/@',
    },
    { href: '/dashboard/favorites', label: t('favorites') },
    { href: '/dashboard/notifications', label: t('notifications') },
    { href: '/dashboard/settings', label: t('settings') },

  ];

  return (
    <nav className="flex flex-col gap-0.5">
      {menuItems.map((item) => {
        const isActive = item.matchPrefix
          ? pathname.startsWith(item.matchPrefix)
          : pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-md px-3 py-1.5 text-xs font-medium leading-5 transition-colors duration-200 ${
              isActive
                ? 'bg-surface-secondary text-foreground'
                : 'text-muted hover:bg-surface-secondary/50 hover:text-foreground'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
