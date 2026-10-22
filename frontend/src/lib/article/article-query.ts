import { getFirstParam, validatePage } from '@/lib/shared/query-utils';
import { SearchParamValue } from '@/lib/shared/searchParam.types';
import { CategorySlug, isCategorySlug } from '@/lib/category/category.types';

export type ArticleOrder = 'asc' | 'desc';

export type ArticleListPathname =
  | '/articles'
  | `/articles/${string}`
  | `/dashboard/@${string}`
  | '/dashboard/favorites';

export type ArticleListStatus = 'PUBLISHED' | 'DRAFT';

const MIN_SEARCH_LENGTH = 3;

export type ArticleQuery = {
  search: string;
  page: number;
  limit: number;
  order: ArticleOrder;
  category: CategorySlug | '';
};

export function isSearchTooShort(search: string): boolean {
  return search.length > 0 && search.length < MIN_SEARCH_LENGTH;
}

export function parseArticleQuery(
  queryParams: Record<string, SearchParamValue>
): ArticleQuery {
  const search = getFirstParam(queryParams.search).trim();
  const page = Number(getFirstParam(queryParams.page));
  const limit = Number(getFirstParam(queryParams.limit));
  const order = getFirstParam(queryParams.order) === 'asc' ? 'asc' : 'desc';
  const rawCategory = getFirstParam(queryParams.category);
  const category = isCategorySlug(rawCategory) ? rawCategory : '';

  return {
    search,
    page: validatePage(page),
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
  if (input.category) params.set('category', input.category);

  return params;
}

export function articlesListHref(
  input: Pick<ArticleQuery, 'page' | 'search' | 'order' | 'category'> & {
    pathname?: ArticleListPathname;
    status?: ArticleListStatus;
  }
) {
  const pathname = input.pathname ?? '/articles';
  const params = articleQueryParams({ ...input, limit: 0 });
  if (input.status) params.set('status', input.status);

  const query: Record<string, string> = {};
  params.forEach((value, key) => {
    query[key] = value;
  });

  if (Object.keys(query).length === 0) {
    return { pathname };
  }

  return {
    pathname,
    query,
  };
}
