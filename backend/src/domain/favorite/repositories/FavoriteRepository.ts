import { FindFavoritesParams } from '@domain/favorite/types/FindFavoriteParams';
import { FindFavoritesResponse } from '@domain/favorite/types/FindFavoriteResponse';
import { SaveFavoriteResult } from '@domain/favorite/types/SaveFavoriteResult';
import { SaveFavoritesParams } from '@domain/favorite/types/SaveFavoritesParams';

export interface FavoriteRepository {
  save(params: SaveFavoritesParams): Promise<SaveFavoriteResult>;
  findMany(params: FindFavoritesParams): Promise<FindFavoritesResponse>;
}
