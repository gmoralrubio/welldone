import { CategorySlug } from '@/app/[locale]/category/category.types';

export type SearchParamValue = string | string[] | undefined;

// TODO: Añadir category
export type ArticleOrder = 'asc' | 'desc';

export type ArticleQuery = {
  search: string;
  page: number;
  limit: number;
  order: ArticleOrder;
  category: CategorySlug;
};

function first(value: SearchParamValue): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}

export function parseArticleQuery(
  queryParams: Record<string, SearchParamValue>
): ArticleQuery {
  const search = first(queryParams.search).trim();
  const page = Number(first(queryParams.page));
  const limit = Number(first(queryParams.limit));
  const order = first(queryParams.order) === 'asc' ? 'asc' : 'desc';
  const category = first(queryParams.category) as CategorySlug;

  return {
    search,
    page: !Number.isFinite(page) || page < 1 ? 1 : page,
    limit,
    order,
    category,
  };
}

export function articleQueryParams(input: ArticleQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (input.search) params.set('search', input.search);
  if (input.page > 1) params.set('page', String(input.page));
  if (input.limit) params.set('limit', String(input.limit));
  if (input.order === 'asc') params.set('order', input.order);
  if (input.category) params.set('category', String(input.category));

  return params;
}

export function articlesListHref(
  input: Pick<ArticleQuery, 'page' | 'search' | 'order' | 'category'>
) {
  const params = articleQueryParams({ ...input, limit: 0 });
  const query: Record<string, string> = {};
  params.forEach((value, key) => {
    query[key] = value;
  });

  if (Object.keys(query).length === 0) {
    return { pathname: '/articles' as const };
  }

  return {
    pathname: '/articles' as const,
    query,
  };
}
