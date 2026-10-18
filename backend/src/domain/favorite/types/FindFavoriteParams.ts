import { Pagination } from '@domain/shared/Pagination';

export type FindFavoritesParams = Pagination & {
  userId: number;
};
