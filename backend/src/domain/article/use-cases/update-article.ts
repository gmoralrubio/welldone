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
    authorUsername: string,
    slug: string,
    authorId: number,
    data: UpdateArticleUseCaseInput
  ): Promise<Article> {
    const existingArticle = await this.articleRepository.findPublishedArticleByAuthorAndSlug({
      authorUsername,
      slug,
    });

    if (!existingArticle || existingArticle.authorId !== authorId) {
      throw new EntityNotFoundError('Article', slug);
    }

    if (data.title && data.title !== existingArticle.title) {
      const articleWithSameTitle = await this.articleRepository.findByTitleAndAuthor(
        data.title,
        authorId
      );

      if (articleWithSameTitle && articleWithSameTitle.id !== existingArticle.id) {
        throw new ValidationError('TITLE_ALREADY_EXISTS');
      }
    }

    return this.articleRepository.update(existingArticle.id, data);
  }
}