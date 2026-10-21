import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import {
  getFavoriteArticleIds,
  getMyArticlesAction,
} from '@/app/[locale]/(site)/articles/actions';
import { ArticleCard } from '@/app/[locale]/components/article/article-card';
import { ArticlePagination } from '@/app/[locale]/components/article/article-pagination';
import { parseArticleQuery } from '@/lib/article/article-query';
import { Button } from '@heroui/react';
import { UserAvatar } from '@/app/[locale]/components/user/user-avatar';
import { ArticleDto } from '@/lib/article/articles.types';
import { BioEditor } from '@/app/[locale]/components/user/bio-editor';

interface UserProfile {
  id: number;
  name: string;
  surname: string;
  username: string;
  email: string;
  bio: string | null;
}

interface AccountPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  currentUser: UserProfile;
  currentTab: string;
}

export default async function PrivateProfile({
  searchParams,
  currentUser,
  currentTab,
}: AccountPageProps) {
  const t = await getTranslations('Dashboard');

  const params = await searchParams;
  const { page, limit, order } = parseArticleQuery(params);

  const currentStatus = currentTab;

  let articles: ArticleDto[] = [];
  let meta = { page: 1, pages: 1 };

  if (currentStatus !== 'ABOUT') {
    const articlesResponse = await getMyArticlesAction({
      page: String(page),
      limit: String(limit),
      order,
      status: currentStatus,
    });

    articles = articlesResponse.data;
    meta = articlesResponse.meta;
  }

  const favoriteIds = new Set(
    await getFavoriteArticleIds(articles.map((article) => article.id))
  );

  const activeTabClass =
    'border-b border-foreground pb-3 text-sm font-medium text-foreground';

  const inactiveTabClass =
    'border-b border-transparent pb-3 text-sm font-medium text-muted transition-colors hover:text-foreground';

  return (
    <div className="flex w-full flex-col gap-16 lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
          {currentUser.name} {currentUser.surname}
        </h1>

        <div className="flex w-full gap-6 border-b border-separator">
          <Link
            href={`/dashboard/@${currentUser.username}`}
            className={currentStatus === 'PUBLISHED' ? activeTabClass : inactiveTabClass}
          >
            {t('tabs.published')}
          </Link>

          <Link
            href={`/dashboard/@${currentUser.username}/draft`}
            className={currentStatus === 'DRAFT' ? activeTabClass : inactiveTabClass}
          >
            {t('tabs.drafts')}
          </Link>

          <Link
            href={`/dashboard/@${currentUser.username}/about`}
            className={currentStatus === 'ABOUT' ? activeTabClass : inactiveTabClass}
          >
            {t('tabs.about')}
          </Link>
        </div>

        <div className="mt-4 flex flex-col gap-8">
          {currentStatus === 'ABOUT' ? (
            <BioEditor initialBio={currentUser.bio} />
          ) : articles.length > 0 ? (
            articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                showActions
                href={`/dashboard/@${article.author.username}/${article.slug}`}
                isFavorite={favoriteIds.has(article.id)}
              />
            ))
          ) : (
            <p className="text-lg text-muted">
              {currentStatus === 'DRAFT'
                ? t('emptyStates.drafts')
                : t('emptyStates.published')}
            </p>
          )}
        </div>

        {currentStatus !== 'ABOUT' && meta.pages > 1 && (
          <div className="mt-4">
            <ArticlePagination
              page={meta.page}
              pages={meta.pages}
              search=""
              order={order}
              category=""
              pathname='/dashboard/@${username}'
              status={currentStatus === 'DRAFT' ? 'DRAFT' : 'PUBLISHED'}
            />
          </div>
        )}
      </div>
      <aside className="flex w-full flex-col gap-6 pt-4 lg:w-40 lg:shrink-0 lg:border-l lg:border-separator lg:pl-10">
        <UserAvatar
          name={currentUser.name}
          surname={currentUser.surname}
          username={currentUser.username}
          size="lg"
          className="h-24 w-24 text-large"
        />

        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-foreground">
            {currentUser.name} {currentUser.surname}
          </h2>

          <span className="text-sm text-muted">@{currentUser.username}</span>
        </div>

        <div className="mt-2 flex gap-2">
          <Link href="/dashboard/settings">
            <Button
              size="sm"
              className="rounded-full bg-black font-medium text-white"
            >
              {t('editProfile')}
            </Button>
          </Link>
        </div>
      </aside>
    </div>
  );
}
