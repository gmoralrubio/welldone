'use client';

import { createArticleAction } from '@/app/[locale]/(site)/articles/actions';
import { useLocale, useTranslations } from 'next-intl';
import { ArticleForm } from '@/app/[locale]/components/article-create/article-form';
import { ArticleBreadcrumbs } from '@/app/[locale]/components/article/article-breadcrumbs';

export default function CreateArticlePage() {
  const locale = useLocale();
  const t = useTranslations('CreateArticlePage');
  const tBreadcrumbs = useTranslations('Breadcrumbs');

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-10">
        <ArticleBreadcrumbs
          current={tBreadcrumbs('new')}
          asSlug={false}
        />

        <header className="flex flex-col gap-4">
          <h1 className="text-4xl xs:text-5xl sm:text-6xl tracking-tight font-serif text-balance">
            {t('title')}
          </h1>
          <p className="text-lg xs:text-xl leading-7 font-serif text-muted text-balance">
            {t('subtitle')}
          </p>
        </header>

        <ArticleForm action={createArticleAction.bind(null, locale)} />
      </main>
    </div>
  );
}
