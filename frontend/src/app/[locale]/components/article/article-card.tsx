'use client';

import { ArticleDto } from '@/lib/article/articles.types';
import { Avatar, Card, Chip } from '@heroui/react';
import { Clock } from '@gravity-ui/icons';
import Image from 'next/image';
import { ArticleCategory } from '@/app/[locale]/components/article/article-category';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { articleHref, readingMinutes } from '@/lib/article/article-presenters';
import { formatAvatarLetter } from '@/lib/shared/format-avatar-letter';
import { useRelativeTime } from '@/app/[locale]/hooks/useRelativeTime';
import { ArticleCardPublishedActions } from '@/app/[locale]/components/article/article-card-published-actions';

type ArticleCardProps = {
  article: ArticleDto;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const href = articleHref(article);
  const minutes = readingMinutes(article.intro, article.content);
  const t = useTranslations('ArticleCard');

  return (
    <Card className="flex flex-col gap-4 bg-white p-6 shadow-xs shadow-accent-dark/30 hover:shadow-md sm:flex-row sm:items-stretch">
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <Avatar
              size="sm"
              className="size-6"
            >
              <Avatar.Fallback className="text-[10px]">
                {formatAvatarLetter(article.author.name, article.author.surname)}
              </Avatar.Fallback>
            </Avatar>
            <Link
              href={href}
              className="text-xs font-semibold text-foreground no-underline"
            >
              {article.author.name} {article.author.surname}
            </Link>
            <span className="text-muted">|</span>
            <span suppressHydrationWarning>{useRelativeTime(article.publishedAt)}</span>
          </div>
          <Link
            href={href}
            className="text-foreground no-underline"
          >
            <h2 className="font-serif text-2xl font-medium text-balance">
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
          {article.status === 'PUBLISHED' ? (
            <ArticleCardPublishedActions />
          ) : (
            <Chip className="text-muted">DRAFT</Chip>
          )}
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
