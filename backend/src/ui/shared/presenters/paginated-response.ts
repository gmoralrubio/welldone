import {
  PaginatedResponse,
  PaginatedResponseParams,
} from '@ui/shared/types/PaginatedResponse';

export const buildPaginatedResponse = <T>(
  params: PaginatedResponseParams<T>
): PaginatedResponse<T> => {
  const pages = Math.max(1, Math.ceil(params.total / params.limit));

  return {
    data: params.data,
    meta: {
      page: params.page,
      pages,
      total_items: params.total,
      per_page: params.limit,
    },
  };
};
