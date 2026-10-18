import { getTranslations } from 'next-intl/server';
import { getMyFavoritesAction } from '@/app/[locale]/(site)/articles/actions';
import { ArticleCard } from '@/app/[locale]/components/article/article-card';
import { ArticlePagination } from '@/app/[locale]/components/article/article-pagination';
import { parseArticleQuery } from '@/lib/article/article-query';
import { SearchParamValue } from '@/lib/shared/searchParam.types';

interface FavoritesPageProps {
  searchParams: Promise<Record<string, SearchParamValue>>;
}

export default async function FavoritesPage({ searchParams }: FavoritesPageProps) {
  const t = await getTranslations('Dashboard');
  const params = await searchParams;
  const { page, limit, order } = parseArticleQuery(params);

  const response = await getMyFavoritesAction({
    page: String(page),
    limit: String(limit),
    order,
  });

  const { data: articles, meta } = response;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <header className="border-b border-separator pb-4">
        <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
          {t('favoritesTitle')}
        </h1>
      </header>

      <div className="flex flex-col gap-8">
        {articles.length > 0 ? (
          articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isFavorite
            />
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-separator p-12 text-center">
            <p className="font-serif text-lg text-muted">{t('favoritesEmpty')}</p>
          </div>
        )}
      </div>

      {meta.pages > 1 && (
        <div className="mt-4">
          <ArticlePagination
            page={meta.page}
            pages={meta.pages}
            search=""
            order={order}
            category=""
            pathname="/dashboard/favorites"
          />
        </div>
      )}
    </div>
  );
}
