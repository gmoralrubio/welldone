'use client';

import { ArticleDto } from '@/lib/article/articles.types';
import { Card, Chip } from '@heroui/react';
import { Clock } from '@gravity-ui/icons';
import Image from 'next/image';
import { ArticleCategory } from '@/app/[locale]/components/article/article-category';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import {
  articleHref,
  authorArticlesHref,
  readingMinutes,
} from '@/lib/article/article-presenters';
import { UserAvatar } from '@/app/[locale]/components/user/user-avatar';
import { useRelativeTime } from '@/app/[locale]/hooks/useRelativeTime';
import { ArticleCardPublishedActions } from '@/app/[locale]/components/article/article-card-published-actions';
import { ArticleActionsMenu } from './article-actions-menu';

type ArticleCardProps = {
  article: ArticleDto;
  showActions?: boolean;
  href?: string;
  isFavorite?: boolean;
};

export function ArticleCard({
  article,
  showActions = false,
  href,
  isFavorite = false,
}: ArticleCardProps) {
  const articleLink = href ?? articleHref(article);
  const minutes = readingMinutes(article.intro, article.content);
  const t = useTranslations('ArticleCard');

  return (
    <Card className="flex flex-col gap-4 bg-white p-6 shadow-xs shadow-accent-dark/30 hover:shadow-md sm:flex-row sm:items-stretch group">
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <UserAvatar
              name={article.author.name}
              surname={article.author.surname}
              username={article.author.username}
              size="sm"
              className="size-6"
              fallbackClassName="text-xs"
            />
            <Link
              href={authorArticlesHref(article.author.username)}
              className="text-xs font-semibold text-foreground no-underline"
            >
              {article.author.name} {article.author.surname}
            </Link>
            <span className="text-muted">|</span>
            <span suppressHydrationWarning>{useRelativeTime(article.publishedAt)}</span>
          </div>
          <Link
            href={articleLink}
            className="text-foreground no-underline"
          >
            <h2 className="font-serif text-2xl font-medium text-balance group-hover:text-accent-foreground">
              {article.title}
            </h2>
          </Link>
          <p className="line-clamp-2 font-serif text-lg text-muted">{article.intro}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            {article.categories.map((category) => (
              <ArticleCategory
                key={category.id}
                categorySlug={category.slug}
              />
            ))}
            <span className="inline-flex items-center gap-1">
              <Clock
                width={12}
                height={12}
              />
              {t('readMinutes', { minutes })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {article.status === 'PUBLISHED' ? (
              <ArticleCardPublishedActions
                commentCount={article.commentCount}
                authorUsername={article.author.username}
                slug={article.slug}
                isFavorite={isFavorite}
              />
            ) : (
              <Chip
                className="text-muted bg-surface-secondary border-none"
                size="sm"
              >
                DRAFT
              </Chip>
            )}

            {showActions && (
              <ArticleActionsMenu
                authorUsername={article.author.username}
                slug={article.slug}
                editLabel={t('edit')}
                deleteLabel={t('delete')}
              />
            )}
          </div>
        </div>
      </div>
      <div className="relative aspect-3/2 w-full shrink-0 overflow-hidden rounded bg-surface-secondary sm:aspect-auto sm:w-48 sm:self-stretch">
        {article.featuredImageUrl ? (
          <Image
            src={article.featuredImageUrl}
            alt=""
            fill
            loading="eager"
            sizes="(min-width: 40rem) 12rem, calc(100vw - 7rem)"
            className="size-full object-cover"
          />
        ) : null}
      </div>
    </Card>
  );
}
