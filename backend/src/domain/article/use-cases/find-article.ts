import { Article, ArticleStatus } from '@domain/article/Article';
import { ArticleRepository } from '@domain/article/repositories/ArticleRepository';
import { BusinessConflictError } from '@domain/errors/BusinessConflictError';
import { EntityNotFoundError } from '@domain/errors/EntityNotFoundError';

export interface FindArticleUseCaseInput {
  authorName: string;
  slug: string;
}

export class FindArticleUseCase {
  readonly articleRepository: ArticleRepository;

  constructor(articleRepository: ArticleRepository) {
    this.articleRepository = articleRepository;
  }

  async execute(params: FindArticleUseCaseInput): Promise<Article | null> {
    const article = await this.articleRepository.findPublishedByAuthorAndSlug(
      params.authorName,
      params.slug
    );

    if (!article) {
      throw new EntityNotFoundError('Article', params.slug);
    }

    if (article.status === 'DRAFT') {
      throw new BusinessConflictError(
        `Article status is ${article.status}, is not accesible`
      );
    }

    const now = new Date();

    if (article.publishedAt > now) {
      throw new BusinessConflictError(`Article has not been published.`);
    }
    return article;
  }
}
