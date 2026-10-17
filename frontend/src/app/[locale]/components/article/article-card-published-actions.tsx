'use client';

import { ArrowUpFromSquare, Bookmark, Comment } from '@gravity-ui/icons';
import { Button } from '@heroui/react';
import { useTranslations } from 'next-intl';

type ArticleCardPublishedActionsProps = {
  commentCount: number;
};

export function ArticleCardPublishedActions({ commentCount }: ArticleCardPublishedActionsProps) {
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
      <Button
        isIconOnly
        variant="ghost"
        size="sm"
        aria-label={t('saveAria')}
      >
        <Bookmark
          width={14}
          height={14}
        />
      </Button>
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
