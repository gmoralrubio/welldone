import { Breadcrumbs } from '@heroui/react';
import { getTranslations } from 'next-intl/server';
import { getPathname } from '@/i18n/navigation';
import { ArticleForm } from '@/app/[locale]/components/article-create/article-form';
import { SiteHeaderClient } from '@/app/[locale]/components/shared/site-header-client';
import { getArticleById, updateArticleAction } from '@/app/[locale]/articles/actions';


import { resolveLocale } from '@/i18n/locale-utils';

export default async function EditArticlePage({ 
  params 
}: { 
  params: { id: string, locale: string } 
}) {
  const { id, locale } = params;

  const safeLocale = resolveLocale(locale);
  
  const t = await getTranslations('EditArticlePage');

  const dashboardHref = getPathname({ locale: safeLocale, href: '/dashboard' });
  const myArticlesHref = getPathname({ locale: safeLocale, href: '/dashboard/my-articles' });

  const article = await getArticleById(id);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeaderClient 
        search="" 
        order="desc" 
        isAuthenticated={true} 
        isEditorMode={true} 
      />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-10">
        
        <Breadcrumbs aria-label="Migas de pan de edición">
          <Breadcrumbs.Item className="uppercase" href={dashboardHref}>
            <span className="text-xs">{t('breadCrumbsDashboard')}</span>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item className="uppercase" href={myArticlesHref}>
            <span className="text-xs">{t('breadCrumbsMyArticles')}</span>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item className="uppercase">
            <span className="text-xs">{t('breadCrumbsEdit')}</span>
          </Breadcrumbs.Item>
        </Breadcrumbs>

        <header className="flex flex-col gap-4">
          <h1 className="text-4xl xs:text-5xl sm:text-6xl tracking-tight font-serif text-balance">
            {t('title')}
          </h1>
          <p className="text-lg xs:text-xl leading-7 font-serif text-muted text-balance">
            {t('subtitle', { title: article?.title || '...' })}
          </p>
        </header>

        <ArticleForm 
          action={updateArticleAction.bind(null, safeLocale, id)} 
          initialData={article} 
        />
        
      </main>
    </div>
  );
}