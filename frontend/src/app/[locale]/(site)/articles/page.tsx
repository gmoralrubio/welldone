import { getArticles } from '@/app/[locale]/(site)/articles/actions';
import { parseArticleQuery } from '@/lib/article/article-query';
import { ArticleCard } from '@/app/[locale]/components/article/article-card';
import { ArticleHero } from '@/app/[locale]/components/article/article-hero';
import { ArticlePagination } from '@/app/[locale]/components/article/article-pagination';
import { SiteSidebar } from '@/app/[locale]/components/shared/site-sidebar';
import { EmptyState } from '@heroui/react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { resolveLocale } from '@/i18n/locale-utils';
import { SearchParamValue } from '@/lib/shared/searchParam.types';

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
  const searchTooShort = criteria.search.length > 0 && criteria.search.length < 3;
  const articles = searchTooShort ? null : await getArticles(queryParams);
  const data = articles?.data ?? [];
  // Primer articulo como destacado
  const featured =
    criteria.page === 1 && criteria.search === '' && criteria.category.length === 0
      ? data[0]
      : undefined;
  // Resto de artículos
  const feed = featured ? data.slice(1) : data;
  const t = await getTranslations('ArticlesPage');

  return (
    <div className="flex min-h-full flex-1 flex-col font-sans text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-8">
        {featured ? <ArticleHero article={featured} /> : null}
        <div className="grid items-start gap-10 py-4 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <section className="min-w-0">
            {searchTooShort ? (
              <p
                role="alert"
                className="mt-10 bg-white p-8 text-center text-muted"
              >
                {t('searchTooShort')}
              </p>
            ) : feed.length === 0 ? (
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
            {articles ? (
              <ArticlePagination
                page={criteria.page}
                pages={articles.meta.pages}
                search={criteria.search}
                order={criteria.order}
                category={criteria.category}
              />
            ) : null}
          </section>
          <SiteSidebar
            search={criteria.search}
            order={criteria.order}
          />
        </div>
      </div>
    </div>
  );
}
