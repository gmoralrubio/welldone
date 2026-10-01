import { ArticleStatus } from '@domain/article/Article';
import { ArticleRepository } from '@domain/article/repositories/ArticleRepository';
import { FindArticlesResponse } from '@domain/article/types/FindArticlesResponse';
import { Pagination } from '@domain/shared/Pagination';

interface ArticleFilterQuery {
  authorId?: number;
  search?: string;
}

export type FindPublishedArticlesUseCaseInput = Pagination & ArticleFilterQuery;

export class FindPublishedArticlesUseCase {
  readonly articleRepository: ArticleRepository;

  constructor(articleRepository: ArticleRepository) {
    this.articleRepository = articleRepository;
  }

  async execute(
    criteria: FindPublishedArticlesUseCaseInput
  ): Promise<FindArticlesResponse> {
    const { articles, total } =
      await this.articleRepository.findPublishedArticles(criteria);
    return { articles, total };
  }
}
