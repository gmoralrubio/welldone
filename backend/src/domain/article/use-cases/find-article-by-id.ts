import { Article } from '../Article';
import { ArticleRepository } from '../repositories/ArticleRepository';
import { EntityNotFoundError } from '../../errors/EntityNotFoundError';

export class FindArticleByIdUseCase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(id: number): Promise<Article> {
    const article = await this.articleRepository.findById(id);

    if (!article) {
      throw new EntityNotFoundError('Article', id.toString());
    }

    return article;
  }
}