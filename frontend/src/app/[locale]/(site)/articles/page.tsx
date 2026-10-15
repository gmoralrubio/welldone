import { getArticles } from '@/app/[locale]/(site)/articles/actions';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ArticleListing } from '@/app/[locale]/components/article/article-listing';
import { isSearchTooShort, parseArticleQuery } from '@/lib/article/article-query';

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
  const searchTooShort = isSearchTooShort(criteria.search);
  const articles = searchTooShort ? null : await getArticles(queryParams);

  return (
    <ArticleListing
      criteria={criteria}
      articles={articles}
    />
  );
}
