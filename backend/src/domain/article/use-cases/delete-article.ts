import { ArticleRepository } from '@domain/article/repositories/ArticleRepository';
import { EntityNotFoundError } from '@domain/errors/EntityNotFoundError';

export class DeleteArticleUseCase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(authorUsername: string, slug: string, userId: number): Promise<void> {
    const article = await this.articleRepository.findPublishedArticleByAuthorAndSlug({
      authorUsername,
      slug,
    });

    if (!article || article.authorId !== userId) {
      throw new EntityNotFoundError('Article', slug);
    }

    await this.articleRepository.delete(article.id);
  }
}