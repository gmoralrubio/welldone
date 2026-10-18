'use client';

import { saveFavoriteAction } from '@/app/[locale]/(site)/articles/actions';
import { Bookmark, BookmarkFill } from '@gravity-ui/icons';
import { Button } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';
import { useActionState } from 'react';

type FavoriteButtonProps = {
  authorUsername: string;
  slug: string;
  saved?: boolean;
};

const initialState = { error: null, saved: false };

export function FavoriteButton({
  authorUsername,
  slug,
  saved = false,
}: FavoriteButtonProps) {
  const t = useTranslations('ArticleCard');
  const locale = useLocale();
  const [state, formAction, isPending] = useActionState(
    saveFavoriteAction.bind(null, locale, authorUsername, slug),
    initialState
  );
  const isSaved = saved || state.saved;
  const ariaLabel = isSaved ? t('savedAria') : t('saveAria');

  const icon = isSaved ? (
    <BookmarkFill
      width={14}
      height={14}
      className="text-success"
    />
  ) : (
    <Bookmark
      width={14}
      height={14}
    />
  );

  const errorMessage = state.error ? (
    <span
      role="alert"
      className="text-xs text-danger"
    >
      {t('saveError')}
    </span>
  ) : null;

  return (
    <form
      action={formAction}
      className="inline-flex items-center gap-2"
    >
      <Button
        type="submit"
        isIconOnly
        variant="ghost"
        size="sm"
        aria-label={ariaLabel}
        isDisabled={isPending || isSaved}
      >
        {icon}
      </Button>
      {errorMessage}
    </form>
  );
}
