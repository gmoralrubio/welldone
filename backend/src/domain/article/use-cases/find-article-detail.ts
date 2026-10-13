import { Article } from '@domain/article/Article';
import { ArticleRepository } from '@domain/article/repositories/ArticleRepository';
import { BusinessConflictError } from '@domain/errors/BusinessConflictError';
import { EntityNotFoundError } from '@domain/errors/EntityNotFoundError';

export interface FindArticleDetailUseCaseInput {
  authorUsername: string;
  slug: string;
}

export class FindArticleDetailUseCase {
  readonly articleRepository: ArticleRepository;

  constructor(articleRepository: ArticleRepository) {
    this.articleRepository = articleRepository;
  }

  async execute(criteria: FindArticleDetailUseCaseInput): Promise<Article> {
    const article = await this.articleRepository.findPublishedArticleBy(criteria);

    if (!article || article.status !== 'PUBLISHED') {
      throw new EntityNotFoundError('Article', criteria.slug);
    }

    if (article.publishedAt > new Date()) {
      throw new BusinessConflictError(`Article has not been published.`);
    }

    return article;
  }
}
