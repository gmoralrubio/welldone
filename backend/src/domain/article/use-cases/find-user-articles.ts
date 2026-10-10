import { ArticleRepository } from '@domain/article/repositories/ArticleRepository';
import { ArticleUserFilterQuery } from '@domain/article/types/ArticleFilterQuery';
import { FindArticlesResponse } from '@domain/article/types/FindArticlesResponse';
import { Pagination } from '@domain/shared/Pagination';

export type FindUserArticlesUseCaseInput = Pagination & ArticleUserFilterQuery;

export class FindUserArticlesUseCase {
  readonly articleRepository: ArticleRepository;
  constructor(articleRepository: ArticleRepository) {
    this.articleRepository = articleRepository;
  }

  async execute(
    criteria: FindUserArticlesUseCaseInput
  ): Promise<FindArticlesResponse> {
    return this.articleRepository.findUserArticles(criteria);
  }
}
