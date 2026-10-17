import { Article } from '@domain/article/Article';
import { ArticleRepository } from '@domain/article/repositories/ArticleRepository';
import { EntityNotFoundError } from '@domain/errors/EntityNotFoundError';

export type FindMyArticleUseCaseInput = {
  authorId: number;
  slug: string;
};

export class FindMyArticleUseCase {
  readonly articleRepository: ArticleRepository;

  constructor(articleRepository: ArticleRepository) {
    this.articleRepository = articleRepository;
  }

  async execute(criteria: FindMyArticleUseCaseInput): Promise<Article> {
    const article = await this.articleRepository.findArticleByIdAndSlug(criteria);

    if (!article) {
      throw new EntityNotFoundError('Article', criteria.slug);
    }

    return article;
  }
}
