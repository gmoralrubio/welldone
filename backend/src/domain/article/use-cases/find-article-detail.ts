import { Article } from '@domain/article/Article';
import { ArticleRepository } from '@domain/article/repositories/ArticleRepository';
import { BusinessConflictError } from '@domain/errors/BusinessConflictError';
import { EntityNotFoundError } from '@domain/errors/EntityNotFoundError';

export interface FindArticleDetailUseCaseInput {
  authorUsername: string;
  slug: string;
  userId?: number;
}

export class FindArticleDetailUseCase {
  readonly articleRepository: ArticleRepository;

  constructor(articleRepository: ArticleRepository) {
    this.articleRepository = articleRepository;
  }

  async execute(criteria: FindArticleDetailUseCaseInput): Promise<Article> {
    const article = await this.articleRepository.findByAuthorAndSlug(criteria);

    if (!article) {
      throw new EntityNotFoundError('Article', criteria.slug);
    }

    if (article.status === 'PUBLISHED') {
      if (article.publishedAt > new Date()) {
        throw new BusinessConflictError(`Article has not been published.`);
      }
      return article;
    }

    if (article.status === 'DRAFT' && criteria.userId === article.authorId) {
      return article;
    }

    throw new EntityNotFoundError('Article', criteria.slug);
  }
}
