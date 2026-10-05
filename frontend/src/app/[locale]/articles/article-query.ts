export type SearchParamValue = string | string[] | undefined;

// TODO: Añadir category
export type ArticleOrder = 'asc' | 'desc';
export type ArticleQuery = {
  search: string;
  page: number;
  limit: number;
  order: ArticleOrder;
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

  return {
    search,
    page: !Number.isFinite(page) || page < 1 ? 1 : page,
    limit,
    order,
  };
}

export function articleQueryParams(input: ArticleQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (input.search) params.set('search', input.search);
  if (input.page > 1) params.set('page', String(input.page));
  if (input.limit) params.set('limit', String(input.limit));
  if (input.order === 'asc') params.set('order', input.order);

  return params;
}

export function articlesHref(input: Pick<ArticleQuery, 'page' | 'search' | 'order'>) {
  const params = articleQueryParams({ ...input, limit: 0 });
  const query = params.toString();
  return query ? `/articles?${query}` : '/articles';
}
