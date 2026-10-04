import { getArticles } from '@/app/articles/actions';
import { parseArticleQuery, type SearchParamValue } from '@/app/articles/article-query';
import { ArticleCard } from '@/app/components/article/article-card';
import { ArticleHero } from '@/app/components/article/article-hero';
import { ArticlePagination } from '@/app/components/article/article-pagination';
import { SiteSidebar } from '@/app/components/shared/site-sidebar';
import { SiteFooter } from '@/app/components/shared/site-footer';
import { SiteHeader } from '@/app/components/shared/site-header';
import { EmptyState } from '@heroui/react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Welldone | Artículos',
  description:
    'WellDone es una red de blogging que pretende ser la competencia de Medium.',
};

type ArticlePageProps = {
  searchParams: Promise<Record<string, SearchParamValue>>;
};

export default async function ArticlesPage({ searchParams }: ArticlePageProps) {
  const queryParams = await searchParams;
  const criteria = parseArticleQuery(queryParams);
  const { data, meta } = await getArticles(queryParams);
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
                {data.length === 0
                  ? 'No hay artículos publicados con esta búsqueda.'
                  : 'No hay más artículos en esta página.'}
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
              page={meta.page}
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
