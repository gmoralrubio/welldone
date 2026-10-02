import { getArticles } from '@/app/articles/actions';
import { type SearchParamValue } from '@/app/articles/article-query';
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

  const { data, meta } = await getArticles(queryParams);
  console.log(data, meta);

  return (
    <section>
      Listado de artículos
      {data.length === 0 ? (
        <p>No existen articles</p>
      ) : (
        <div>
          {data.map((article) => (
            <p key={article.id}>{article.title}</p>
          ))}
        </div>
      )}
    </section>
  );
}
