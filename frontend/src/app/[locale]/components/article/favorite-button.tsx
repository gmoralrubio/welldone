'use client';

import { submitFavoriteAction } from '@/app/[locale]/(site)/articles/actions';
import { ThumbsUp, ThumbsUpFill } from '@gravity-ui/icons';
import { Button } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';
import { useActionState, useOptimistic } from 'react';

type FavoriteButtonProps = {
  authorUsername: string;
  slug: string;
  saved?: boolean;
};

const initialState = { error: null, saved: null as boolean | null };

export function FavoriteButton({
  authorUsername,
  slug,
  saved = false,
}: FavoriteButtonProps) {
  const t = useTranslations('ArticleCard');
  const locale = useLocale();
  const [state, formAction, isPending] = useActionState(
    submitFavoriteAction.bind(null, locale, authorUsername, slug),
    initialState
  );
  const isSaved = state.saved ?? saved;
  const [optimisticSaved, addOptimistic] = useOptimistic(
    isSaved,
    (_current, toggleFavorite: 'save' | 'remove') => toggleFavorite === 'save'
  );
  const ariaLabel = optimisticSaved ? t('removeAria') : t('saveAria');

  function submit(formData: FormData) {
    addOptimistic(formData.get('toggleFavorite') === 'remove' ? 'remove' : 'save');
    formAction(formData);
  }

  const icon = optimisticSaved ? (
    <ThumbsUpFill
      width={14}
      height={14}
      className="text-success"
    />
  ) : (
    <ThumbsUp
      width={14}
      height={14}
    />
  );

  const errorMessage = state.error ? (
    <span
      role="alert"
      className="text-xs text-danger"
    >
      {isSaved ? t('removeError') : t('saveError')}
    </span>
  ) : null;

  return (
    <form
      action={submit}
      className="inline-flex items-center gap-2"
    >
      <input
        type="hidden"
        name="toggleFavorite"
        value={isSaved ? 'remove' : 'save'}
      />
      <Button
        type="submit"
        isIconOnly
        variant="ghost"
        size="sm"
        aria-label={ariaLabel}
        isDisabled={isPending}
      >
        {icon}
      </Button>
      {errorMessage}
    </form>
  );
}
