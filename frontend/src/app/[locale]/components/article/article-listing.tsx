import { getFavoriteArticleIds } from '@/app/[locale]/(site)/articles/actions';
import { ArticleCard } from '@/app/[locale]/components/article/article-card';
import { ArticleHero } from '@/app/[locale]/components/article/article-hero';
import { ArticlePagination } from '@/app/[locale]/components/article/article-pagination';
import { SiteSidebar } from '@/app/[locale]/components/shared/site-sidebar';
import { ArticleDto } from '@/lib/article/articles.types';
import {
  ArticleListPathname,
  ArticleQuery,
  isSearchTooShort,
} from '@/lib/article/article-query';
import { PaginatedResponse } from '@/lib/shared/pagination.types';
import { EmptyState } from '@heroui/react';
import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';

type ArticleListingProps = {
  criteria: ArticleQuery;
  articles: PaginatedResponse<ArticleDto> | null;
  listPath?: ArticleListPathname;
  heading?: ReactNode;
  emptyCatalog?: string;
};

export async function ArticleListing({
  criteria,
  articles,
  listPath,
  heading,
  emptyCatalog,
}: ArticleListingProps) {
  const data = articles?.data ?? [];
  const favoriteIds = new Set(
    await getFavoriteArticleIds(data.map((article) => article.id))
  );
  const featured =
    criteria.page === 1 && criteria.search === '' && criteria.category.length === 0
      ? data[0]
      : undefined;
  const feed = featured ? data.slice(1) : data;
  const searchTooShort = isSearchTooShort(criteria.search);
  const t = await getTranslations('ArticlesPage');

  return (
    <div className="flex min-h-full flex-1 flex-col font-sans text-foreground">
      <div className="mx-auto flex w-full max-w-272 flex-1 flex-col px-8">
        {heading}
        {featured ? (
          <ArticleHero
            article={featured}
            isFavorite={favoriteIds.has(featured.id)}
          />
        ) : null}
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
                {data.length === 0 ? (emptyCatalog ?? t('emptySearch')) : t('emptyPage')}
              </EmptyState>
            ) : (
              <div className="flex flex-col gap-6">
                {feed.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    isFavorite={favoriteIds.has(article.id)}
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
                pathname={listPath}
              />
            ) : null}
          </section>
          <SiteSidebar
            search={criteria.search}
            order={criteria.order}
            category={criteria.category}
            listPath={listPath}
          />
        </div>
      </div>
    </div>
  );
}
