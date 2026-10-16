import { ArticlesAuthorHeading } from '@/app/[locale]/components/article/articles-author-heading';
import { getArticlesByAuthor } from '@/app/[locale]/(site)/articles/actions';
import { authorUsernameSchema } from '@/app/[locale]/(site)/articles/[authorUsername]/schema';
import { ArticleListing } from '@/app/[locale]/components/article/article-listing';
import { isSearchTooShort, parseArticleQuery } from '@/lib/article/article-query';
import { authorArticlesHref } from '@/lib/article/article-presenters';
import { resolveLocale } from '@/i18n/locale-utils';
import { SearchParamValue } from '@/lib/shared/searchParam.types';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

type AuthorArticlesPageProps = {
  searchParams: Promise<Record<string, SearchParamValue>>;
  params: Promise<{ locale: string; authorUsername: string }>;
};

export async function generateMetadata({
  params,
}: AuthorArticlesPageProps): Promise<Metadata> {
  const { locale: paramLocale, authorUsername } = await params;
  const locale = resolveLocale(paramLocale);
  const t = await getTranslations({ locale, namespace: 'AppMetadata' });

  return {
    title: t('authorArticlesTitle', { author: authorUsername }),
    description: t('authorArticlesDescription', { author: authorUsername }),
  };
}

export default async function AuthorArticlesPage({
  searchParams,
  params,
}: AuthorArticlesPageProps) {
  const { authorUsername: rawAuthorUsername } = await params;
  const parsedAuthor = authorUsernameSchema.safeParse(rawAuthorUsername);
  if (!parsedAuthor.success) notFound();

  const authorUsername = parsedAuthor.data;

  const queryParams = await searchParams;
  const criteria = parseArticleQuery(queryParams);
  const searchTooShort = isSearchTooShort(criteria.search);
  const articles = searchTooShort
    ? null
    : await getArticlesByAuthor(authorUsername, queryParams);

  if (!searchTooShort && !articles) notFound();

  const author = articles?.data[0]?.author;
  const hasFilters = criteria.search !== '' || criteria.category.length > 0;
  const t = await getTranslations('AuthorArticlesPage');
  const tArticles = await getTranslations('ArticlesPage');

  return (
    <ArticleListing
      criteria={criteria}
      articles={articles}
      listPath={authorArticlesHref(authorUsername)}
      emptyCatalog={hasFilters ? tArticles('emptySearch') : t('empty')}
      heading={
        <div className="flex flex-col gap-4 pt-8">
          <ArticlesAuthorHeading
            authorUsername={authorUsername}
            author={author}
          />
        </div>
      }
    />
  );
}
