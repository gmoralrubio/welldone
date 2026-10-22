import { ArticleRepository } from '@domain/article/repositories/ArticleRepository';
import { ArticleUserFilterQuery } from '@domain/article/types/ArticleFilterQuery';
import { FindArticlesResponse } from '@domain/article/types/FindArticlesResponse';
import { Pagination } from '@domain/shared/Pagination';

export type FindMyArticlesUseCaseInput = Pagination & 
  Omit<ArticleUserFilterQuery, 'status'> & {
    status?: 'PUBLISHED' | 'DRAFT' | 'SCHEDULED';
  };

export class FindMyArticlesUseCase {
  readonly articleRepository: ArticleRepository;
  constructor(articleRepository: ArticleRepository) {
    this.articleRepository = articleRepository;
  }

  async execute(criteria: FindMyArticlesUseCaseInput): Promise<FindArticlesResponse> {
    return this.articleRepository.findMyArticles(criteria);
  }
}
