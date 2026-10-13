'use client';

import { ArrowUpFromSquare, Bookmark, Comment } from '@gravity-ui/icons';
import { Button } from '@heroui/react';
import { useTranslations } from 'next-intl';

export function ArticleCardPublishedActions() {
  const t = useTranslations('ArticleCard');

  return (
    <div className="flex items-center">
      <Button
        isIconOnly
        variant="ghost"
        size="sm"
        aria-label={t('commentsAria')}
      >
        <Comment
          width={14}
          height={14}
        />
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
