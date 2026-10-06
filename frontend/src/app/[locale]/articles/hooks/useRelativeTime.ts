import { getElapsedMs } from '@/app/[locale]/articles/article-presenters';
import { useTranslations } from 'next-intl';

// Formatea el tiempo que ha pasado desde que se publicó un artículo
export function useRelativeTime(isoDate: string): string {
  const elapsedMs = getElapsedMs(isoDate);
  const minutes = Math.max(1, Math.round(elapsedMs / 60_000));

  const t = useTranslations('ArticleCard');

  if (minutes < 60) return t('relativeTime.minutes', { minutes: minutes });

  const hours = Math.round(minutes / 60);
  if (hours < 24) return t('relativeTime.hours', { hours: hours });

  const days = Math.round(hours / 24);
  return t('relativeTime.days', { days: days });
}
