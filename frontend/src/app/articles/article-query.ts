export type SearchParamValue = string | string[] | undefined;

// TODO: Añadir category
export type ArticleQuery = {
  search: string;
  page: number;
  limit: number;
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

  return {
    search,
    page: !Number.isFinite(page) || page < 1 ? 1 : page,
    limit,
  };
}

export function articleQueryParams(input: ArticleQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (input.search) params.set('search', input.search);
  if (input.page > 1) params.set('page', String(input.page));
  if (input.limit) params.set('limit', String(input.limit));

  return params;
}
