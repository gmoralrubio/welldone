export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    pages: number;
    per_page: number;
    total_items: number;
  };
}

export interface PaginatedResponseParams<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
