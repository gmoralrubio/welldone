import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import {
  getArticlesByAuthor,
  getFavoriteArticleIds,
} from '@/app/[locale]/(site)/articles/actions';
import { ArticleCard } from '@/app/[locale]/components/article/article-card';
import { ArticlePagination } from '@/app/[locale]/components/article/article-pagination';
import { parseArticleQuery } from '@/lib/article/article-query';
import { Button } from '@heroui/react';
import { UserAvatar } from '@/app/[locale]/components/user/user-avatar';
import { ArticleDto } from '@/lib/article/articles.types';
import { sanitizeBio } from '@/lib/user/sanitize-bio';

interface UserProfile {
  id: number;
  name: string;
  surname: string;
  username: string;
  email: string;
  bio?: string | null;
}

interface PublicProfileProps {
  targetUsername: string;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  currentTab: string;
}

export default async function PublicProfile({
  targetUsername,
  searchParams,
  currentTab,
}: PublicProfileProps) {
  const t = await getTranslations('Dashboard');
  const tDetail = await getTranslations('ArticleDetailPage');
  const tProfile = await getTranslations('PublicProfile');

  const params = await searchParams;
  const { page, limit, order } = parseArticleQuery(params);

  const currentStatus = currentTab;

  let articles: ArticleDto[] = [];
  let meta = { page: 1, pages: 1 };

  let targetUser: UserProfile | null = null;

  try {
    const userRes = await fetch(
      `${process.env.API_URL}/api/users/profile/${targetUsername}`,
      {
        cache: 'no-store',
      }
    );

    if (userRes.ok) {
      targetUser = await userRes.json();
    }
  } catch {
    console.error('Error fetching public user profile');
  }

  if (currentStatus !== 'ABOUT') {
    const articlesResponse = await getArticlesByAuthor(targetUsername, {
      page: String(page),
      limit: String(limit),
      order,
      status: 'PUBLISHED',
    });

    if (articlesResponse) {
      articles = articlesResponse.data;
      meta = articlesResponse.meta;
    }
  }

  const favoriteIds = new Set(
    await getFavoriteArticleIds(articles.map((article) => article.id))
  );

  const activeTabClass =
    'border-b border-foreground pb-3 text-sm font-medium text-foreground';

  const inactiveTabClass =
    'border-b border-transparent pb-3 text-sm font-medium text-muted transition-colors hover:text-foreground';

  const safeBio = targetUser?.bio ? sanitizeBio(targetUser.bio) : '';

  if (!targetUser) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <h1 className="mb-2 font-serif text-3xl font-bold">{tProfile('userNotFound')}</h1>

        <p className="text-muted">
          {tProfile('userNotFoundDesc', {
            username: targetUsername,
          })}
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
          {targetUser.name} {targetUser.surname}
        </h1>

        <div className="flex w-full gap-6 border-b border-separator">
          <Link
            href={`/dashboard/@${targetUser.username}`}
            className={currentStatus === 'PUBLISHED' ? activeTabClass : inactiveTabClass}
          >
            {t('tabs.published')}
          </Link>

          <Link
            href={`/dashboard/@${targetUser.username}/about`}
            className={currentStatus === 'ABOUT' ? activeTabClass : inactiveTabClass}
          >
            {t('tabs.about')}
          </Link>
        </div>

        <div className="mt-4 flex flex-col gap-8">
          {currentStatus === 'ABOUT' ? (
            <div className="flex flex-col rounded-lg bg-surface-secondary p-8">
              <h3 className="mb-4 font-serif text-xl font-bold text-foreground">
                {tProfile('aboutUser', {
                  name: targetUser.name,
                })}
              </h3>
              {safeBio ? (
                <div
                  className="prose prose-sm sm:prose-base dark:prose-invert max-w-none font-serif text-muted leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: safeBio }}
                />
              ) : (
                <p className="text-muted leading-relaxed italic">
                  {tProfile('emptyBio')}
                </p>
              )}
            </div>
          ) : articles.length > 0 ? (
            articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                showActions={false}
                href={`/articles/${targetUsername}/${article.slug}`}
                isFavorite={favoriteIds.has(article.id)}
              />
            ))
          ) : (
            <p className="text-lg text-muted">{t('emptyStates.published')}</p>
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
              pathname={`/dashboard/@${targetUser.username}`}
              status="PUBLISHED"
            />
          </div>
        )}
      </div>

      <aside className="flex w-full flex-col gap-6 pt-4 lg:w-48 lg:shrink-0 lg:border-l lg:border-separator lg:pl-10">
        <UserAvatar
          name={targetUser.name}
          surname={targetUser.surname}
          username={targetUser.username}
          size="lg"
          className="h-24 w-24 text-large"
        />

        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-foreground">
            {targetUser.name} {targetUser.surname}
          </h2>

          <span className="text-sm text-muted">@{targetUser.username}</span>
        </div>

        <div className="mt-2 flex gap-2">
          <Button
            size="sm"
            variant="primary"
            className="rounded-full bg-accent px-6 font-medium text-white"
          >
            {tDetail('follow')}
          </Button>
        </div>
      </aside>
    </div>
  );
}
