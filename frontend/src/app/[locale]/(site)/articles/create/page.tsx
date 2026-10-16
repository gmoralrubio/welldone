'use client';

import { Breadcrumbs } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';
import { getPathname } from '@/i18n/navigation';
import { ArticleForm } from '@/app/[locale]/components/article-create/article-form';
import { createArticleAction } from '@/app/[locale]/(site)/articles/actions'; 

export default function CreateArticlePage() {
  const locale = useLocale();
  const t = useTranslations('CreateArticlePage');
  const tBread = useTranslations('Breadcrumbs');

  const homeHref = getPathname({ locale, href: '/' });
  const articlesHref = getPathname({ locale, href: '/articles' });

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-10">
        <Breadcrumbs aria-label={tBread('ariaLabel')}>
          <Breadcrumbs.Item className="uppercase" href={homeHref}>
            <span className="text-xs">{tBread('home')}</span>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item className="uppercase" href={articlesHref}>
            <span className="text-xs">{tBread('articles')}</span>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item className="uppercase">
            <span className="text-xs">{tBread('new')}</span>
          </Breadcrumbs.Item>
        </Breadcrumbs>

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