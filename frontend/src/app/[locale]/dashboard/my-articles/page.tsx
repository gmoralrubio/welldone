import { getTranslations } from 'next-intl/server';
import { getMyArticlesAction } from '@/app/[locale]/articles/actions';
import { ArticleCard } from '@/app/[locale]/components/article/article-card';
import { ArticlePagination } from '@/app/[locale]/components/article/article-pagination';
import { parseArticleQuery } from '@/app/[locale]/articles/article-query';

interface MyArticlesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function MyArticlesPage({ searchParams }: MyArticlesPageProps) {
  const t = await getTranslations('Dashboard');
  const params = await searchParams;
  const { page, limit, order } = parseArticleQuery(params);

  const response = await getMyArticlesAction({ page: String(page), limit: String(limit), order });
  const { data: articles, meta } = response;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <header className="border-b border-separator pb-4">
        <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
          Mis artículos
        </h1>
      </header>

      <div className="flex flex-col gap-8">
        {articles.length > 0 ? (
          articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-separator p-12 text-center">
            <p className="font-serif text-lg text-muted">Aún no has escrito ningún artículo.</p>
          </div>
        )}
      </div>

      {meta.pages > 1 && (
        <div className="mt-4">
          <ArticlePagination page={meta.page} pages={meta.pages} search="" order={order} />
        </div>
      )}
    </div>
  );
}