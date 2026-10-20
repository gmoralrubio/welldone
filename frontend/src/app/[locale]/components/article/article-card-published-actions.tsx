'use client';

import { FavoriteButton } from '@/app/[locale]/components/article/favorite-button';
import { Comment } from '@gravity-ui/icons';
import { useTranslations } from 'next-intl';

type ArticleCardPublishedActionsProps = {
  commentCount: number;
  authorUsername: string;
  slug: string;
  isFavorite?: boolean;
};

export function ArticleCardPublishedActions({
  commentCount,
  authorUsername,
  slug,
  isFavorite = false,
}: ArticleCardPublishedActionsProps) {
  const t = useTranslations('ArticleCard');

  return (
    <div className="flex items-center">
      <span
        aria-label={t('commentsAria', { count: commentCount })}
        className="inline-flex items-center gap-1 px-2 text-xs "
      >
        <Comment
          width={14}
          height={14}
          aria-hidden
        />
        <span aria-hidden>{commentCount}</span>
      </span>
      <FavoriteButton
        authorUsername={authorUsername}
        slug={slug}
        saved={isFavorite}
      />
    </div>
  );
}
