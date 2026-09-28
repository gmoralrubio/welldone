import { Article, ArticleStatus } from '@domain/article/Article';
import { ArticleRepository } from '@domain/article/repositories/ArticleRepository';

export interface FindArticleUseCaseInput {
  authorId: number;
  slug: string;
}

export class FindArticleUseCase {
  readonly articleRepository: ArticleRepository;

  constructor(articleRepository: ArticleRepository) {
    this.articleRepository = articleRepository;
  }

  async execute(params: FindArticleUseCaseInput): Promise<Article | null> {
    const article = await this.articleRepository.findPublishedByAuthorAndSlug(
      params.authorId,
      params.slug
    );
    return article;
  }
}
