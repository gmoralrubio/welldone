export type SearchParamValue = string | string[] | undefined;

// TODO: Añadir category
export type ArticleQuery = {
  query: string;
  page: number;
};

export const ARTICLE_PAGE_SIZE = 4;
export type ArticlePageSize = typeof ARTICLE_PAGE_SIZE;
function first(value: SearchParamValue): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}

export function parseArticleQuery(
  queryParams: Record<string, SearchParamValue>
): ArticleQuery {
  const query = first(queryParams.query).trim();
  const page = Number(first(queryParams.page));

  return {
    query,
    page: !Number.isFinite(page) || page < 1 ? 1 : page,
  };
}
