import { Favorite } from '@domain/favorite/Favorite';

export interface SaveFavoriteResult {
  favorite: Favorite;
  created: boolean;
}
