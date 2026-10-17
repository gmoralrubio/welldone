import { ArticleRepository } from '@domain/article/repositories/ArticleRepository';

export class DeleteArticleUseCase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(articleId: number, userId: number): Promise<void> {

    const article = await this.articleRepository.findById(articleId);

    if (!article) {
      throw new Error('ARTICLE_NOT_FOUND');
    }

    if (article.authorId !== userId) {
      throw new Error('FORBIDDEN_ACTION');
    }

    await this.articleRepository.delete(articleId);
  }
}