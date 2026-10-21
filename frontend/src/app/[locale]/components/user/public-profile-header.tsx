import { Link } from '@/i18n/navigation';
import { Button } from '@heroui/react';
import { UserAvatar } from '@/app/[locale]/components/user/user-avatar';
import { getTranslations } from 'next-intl/server';

interface PublicProfileHeaderProps {
  user: {
    name: string;
    surname: string;
    username: string;
  };
  currentTab: 'PUBLISHED' | 'ABOUT';
}

export async function PublicProfileHeader({ user, currentTab }: PublicProfileHeaderProps) {
  const t = await getTranslations('Dashboard');
  const tDetail = await getTranslations('ArticleDetailPage');

  const activeTabClass = 'border-b border-foreground pb-3 text-sm font-medium text-foreground';
  const inactiveTabClass = 'border-b border-transparent pb-3 text-sm font-medium text-muted transition-colors hover:text-foreground';

  return (
    <div className="flex flex-col gap-6 mb-8 w-full">
      {/* 1. Info del Usuario y Avatar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <UserAvatar
            name={user.name}
            surname={user.surname}
            username={user.username}
            size="lg"
            className="h-24 w-24 text-2xl"
          />
          <div className="flex flex-col gap-1">
            <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              {user.name} {user.surname}
            </h1>
            <span className="text-lg text-muted">@{user.username}</span>
          </div>
        </div>
        
        {/* Botón Seguir */}
        <Button
          size="md"
          variant="primary"
          className="rounded-full bg-accent px-6 font-medium text-white"
        >
          {tDetail('follow')}
        </Button>
      </div>

      {/* 2. Pestañas (Tabs) */}
      <div className="flex w-full gap-6 border-b border-separator mt-2">
        <Link
          href={`/articles/${user.username}`}
          className={currentTab === 'PUBLISHED' ? activeTabClass : inactiveTabClass}
        >
          {t('tabs.published')}
        </Link>
        <Link
          href={`/articles/${user.username}/about`}
          className={currentTab === 'ABOUT' ? activeTabClass : inactiveTabClass}
        >
          {t('tabs.about')}
        </Link>
      </div>
    </div>
  );
}