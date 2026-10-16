'use client';

import { Link } from '@/i18n/navigation';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

type ArticlesErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ArticlesError({ error, reset }: ArticlesErrorProps) {
  const t = useTranslations('ArticlesError');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto grid max-w-xl gap-4 p-6 py-10 sm:p-8">
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{t('label')}</p>
      <h1 className="text-3xl font-semibold tracking-tight">{t('title')}</h1>
      <p className="text-zinc-600 dark:text-zinc-300">{t('description')}</p>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {t('retry')}
        </button>
        <Link
          href="/articles"
          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          {t('backToArticles')}
        </Link>
      </div>
    </section>
  );
}
