import { getFirstParam, validatePage } from '@/lib/shared/query-utils';
import { SearchParamValue } from '@/lib/shared/searchParam.types';

export function parseCommentsQuery(value: SearchParamValue): number {
  const raw = getFirstParam(value);
  const page = Number(raw);

  return validatePage(page);
}

export function commentsHref(authorUsername: string, slug: string, page: number) {
  const pathname = `/articles/${encodeURIComponent(authorUsername)}/${encodeURIComponent(slug)}`;
  if (page <= 1) return pathname;
  return `${pathname}?commentsPage=${page}`;
}
