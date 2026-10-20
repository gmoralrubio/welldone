'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function SidebarMenu({ username }: { username?: string }) {
  const pathname = usePathname();
  const t = useTranslations('Dashboard'); 


  const menuItems = [
    { href: `/dashboard/@${username}`, label: t('nav.profile'), matchPrefix: `/dashboard/@`},
    { href: '/dashboard/favorites', label: t('nav.favorites') },
    { href: '/dashboard/highlights', label: t('nav.highlights') },
    { href: '/dashboard/notifications', label: t('nav.notifications') },
    { href: '/dashboard/settings', label: t('nav.settings') },
  ];

  return (
    <nav className="flex flex-col gap-2">
      {menuItems.map((item) => {
        const isActive = item.matchPrefix 
          ? pathname.startsWith(item.matchPrefix) 
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
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