import { Article } from '../Article';
import {
  ArticleRepository,
  CreateArticleParams,
} from '../repositories/ArticleRepository';
import { UserRepository } from '../../user/repositories/UserRepository';
import { EntityNotFoundError } from '../../errors/EntityNotFoundError';
import { ValidationError } from '../../errors/ValidationError';

export type CreateArticleUseCaseInput = CreateArticleParams;

export class CreateArticleUseCase {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(input: CreateArticleUseCaseInput): Promise<Article> {
    const author = await this.userRepository.findById(input.authorId);
    if (!author) {
      throw new EntityNotFoundError('User', input.authorId.toString());
    }

    if (!input.title || input.title.trim() === '') {
      throw new ValidationError('El título es obligatorio');
    }
    if (!input.content || input.content.trim() === '') {
      throw new ValidationError('El contenido es obligatorio');
    }
    if (!input.categorySlugs || input.categorySlugs.length === 0) {
      throw new ValidationError(
        'El artículo debe tener al menos una categoría'
      );
    }

    const finalSlug = input.slug?.trim()
      ? input.slug
      : input.title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');

    return this.articleRepository.create({
      ...input,
      slug: finalSlug,
      publishedAt: input.publishedAt || new Date(),
    });
  }
}
