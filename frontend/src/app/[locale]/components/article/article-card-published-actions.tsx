'use client';

import { FavoriteButton } from '@/app/[locale]/components/article/favorite-button';
import { ArrowUpFromSquare, Comment } from '@gravity-ui/icons';
import { Button } from '@heroui/react';
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
      <Button
        variant="ghost"
        size="sm"
        aria-label={t('commentsAria', { count: commentCount })}
      >
        <Comment
          width={14}
          height={14}
        />
        <span className="text-xs">{commentCount}</span>
      </Button>
      <FavoriteButton
        authorUsername={authorUsername}
        slug={slug}
        saved={isFavorite}
      />
      <Button
        isIconOnly
        variant="ghost"
        size="sm"
        aria-label={t('shareAria')}
      >
        <ArrowUpFromSquare
          width={14}
          height={14}
        />
      </Button>
    </div>
  );
}
