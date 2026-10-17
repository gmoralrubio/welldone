import { Article } from '../Article';
import { ArticleRepository } from '../repositories/ArticleRepository';
import { ValidationError } from '../../errors/ValidationError'; 
import { EntityNotFoundError } from '../../errors/EntityNotFoundError';

export interface UpdateArticleUseCaseInput {
  title?: string;
  intro?: string;
  content?: string;
  status?: 'DRAFT' | 'PUBLISHED';
  publishedAt?: Date | null;
  featuredImageUrl?: string | null;
  featuredVideoUrl?: string | null;
  categorySlugs?: string[];
}

export class UpdateArticleUseCase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(
    articleId: number, 
    authorId: number, 
    data: UpdateArticleUseCaseInput
  ): Promise<Article> {

    const existingArticle = await this.articleRepository.findById(articleId);
    if (!existingArticle) {
      throw new EntityNotFoundError('Article', articleId.toString());
    }
    
    if (existingArticle.author.id !== authorId) {
      throw new Error('No tienes permisos para editar este artículo');
    }

    if (data.title && data.title !== existingArticle.title) {
      const articleWithSameTitle = await this.articleRepository.findByTitleAndAuthor(
        data.title, 
        authorId
      );

      if (articleWithSameTitle && articleWithSameTitle.id !== articleId) {
        throw new ValidationError('TITLE_ALREADY_EXISTS');
      }
    }

    return this.articleRepository.update(articleId, data);
  }
}