import { getArticles } from '@/app/[locale]/articles/actions';
import {
  parseArticleQuery,
  type SearchParamValue,
} from '@/app/[locale]/articles/article-query';
import { ArticleCard } from '@/app/[locale]/components/article/article-card';
import { ArticleHero } from '@/app/[locale]/components/article/article-hero';
import { ArticlePagination } from '@/app/[locale]/components/article/article-pagination';
import { SiteSidebar } from '@/app/[locale]/components/shared/site-sidebar';
import { SiteFooter } from '@/app/[locale]/components/shared/site-footer';
import { SiteHeader } from '@/app/[locale]/components/shared/site-header';
import { EmptyState } from '@heroui/react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { resolveLocale } from '@/i18n/locale-utils';

type ArticlePageProps = {
  searchParams: Promise<Record<string, SearchParamValue>>;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { locale: paramLocale } = await params;
  const locale = resolveLocale(paramLocale);
  const t = await getTranslations({ locale, namespace: 'AppMetadata' });

  return {
    title: t('articlesTitle'),
    description: t('articlesDescription'),
  };
}

export default async function ArticlesPage({ searchParams }: ArticlePageProps) {
  const queryParams = await searchParams;
  const criteria = parseArticleQuery(queryParams);
  const { data, meta } = await getArticles(queryParams);
  const t = await getTranslations('ArticlesPage');
  // Primer articulo como destacado
  const featured = criteria.page === 1 && criteria.search === '' ? data[0] : undefined;
  // Resto de artículos
  const feed = featured ? data.slice(1) : data;

  return (
    <div className="flex min-h-full flex-1 flex-col font-sans text-foreground">
      <SiteHeader
        search={criteria.search}
        order={criteria.order}
      />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-8">
        {featured ? <ArticleHero article={featured} /> : null}
        <div className="grid items-start gap-10 py-4 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <section className="min-w-0">
            {feed.length === 0 ? (
              <EmptyState className="mt-10 bg-white p-8 text-center text-muted">
                {data.length === 0 ? t('emptySearch') : t('emptyPage')}
              </EmptyState>
            ) : (
              <div className="flex flex-col gap-6">
                {feed.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                  />
                ))}
              </div>
            )}
            <ArticlePagination
              page={criteria.page}
              pages={meta.pages}
              search={criteria.search}
              order={criteria.order}
            />
          </section>
          <SiteSidebar
            search={criteria.search}
            order={criteria.order}
          />
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
