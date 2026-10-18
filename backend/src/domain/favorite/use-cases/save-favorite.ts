import { ArticleRepository } from '@domain/article/repositories/ArticleRepository';
import { BusinessConflictError } from '@domain/errors/BusinessConflictError';
import { EntityNotFoundError } from '@domain/errors/EntityNotFoundError';
import { FavoriteRepository } from '@domain/favorite/repositories/FavoriteRepository';
import { SaveFavoriteResult } from '@domain/favorite/types/SaveFavoriteResult';

export type SaveFavoriteUseCaseInput = {
  userId: number;
  authorUsername: string;
  slug: string;
};

export class SaveFavoriteUseCase {
  readonly favoriteRepository: FavoriteRepository;
  readonly articleRepository: ArticleRepository;

  constructor(
    favoriteRepository: FavoriteRepository,
    articleRepository: ArticleRepository
  ) {
    this.favoriteRepository = favoriteRepository;
    this.articleRepository = articleRepository;
  }

  async execute(input: SaveFavoriteUseCaseInput): Promise<SaveFavoriteResult> {
    const article =
      await this.articleRepository.findPublishedArticleByAuthorAndSlug(input);

    if (!article || article.status !== 'PUBLISHED') {
      throw new EntityNotFoundError('Article', input.slug);
    }

    const now = new Date();

    if (article.publishedAt > now) {
      throw new BusinessConflictError('Article has not been published.');
    }

    return this.favoriteRepository.save({
      userId: input.userId,
      articleId: article.id,
    });
  }
}
