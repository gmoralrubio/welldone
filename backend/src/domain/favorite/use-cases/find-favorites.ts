import { FavoriteRepository } from '@domain/favorite/repositories/FavoriteRepository';
import { FindFavoritesResponse } from '@domain/favorite/types/FindFavoriteResponse';
import { Pagination } from '@domain/shared/Pagination';

export type FindFavoritesUseCaseInput = Pagination & {
  userId: number;
};

export class FindMyFavoritesUseCase {
  readonly favoriteRepository: FavoriteRepository;

  constructor(favoriteRepository: FavoriteRepository) {
    this.favoriteRepository = favoriteRepository;
  }

  async execute(input: FindFavoritesUseCaseInput): Promise<FindFavoritesResponse> {
    return this.favoriteRepository.findMany(input);
  }
}
