import { Request, Response, NextFunction } from 'express';
import { PrismaArticleRepository } from '@infrastructure/article/PrismaArticleRepository';
import { PrismaUserRepository } from '@infrastructure/user/repositories/PrismaUserRepository';
import { CreateArticleUseCase } from '@domain/article/use-cases/create-article';
import { createArticleValidationSchema } from '@ui/article/validators/articles-validator';
import { UnauthorizedError } from '@domain/errors/UnauthorizedError';

export const createArticleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.authorId) {
      throw new UnauthorizedError('Debes estar autenticado para crear un artículo');
    }

    const validatedData = createArticleValidationSchema.parse(req.body);

    const articleRepository = new PrismaArticleRepository();
    const userRepository = new PrismaUserRepository();
    const createArticleUseCase = new CreateArticleUseCase(articleRepository, userRepository);

    const newArticle = await createArticleUseCase.execute({
      ...validatedData,
      slug: validatedData.slug || '',
      publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : new Date(),
      featuredImageUrl: validatedData.featuredImageUrl || null,
      featuredVideoUrl: validatedData.featuredVideoUrl || null,
      authorId: req.authorId,
    });

    res.status(201).json({ message: 'Artículo creado correctamente', article: newArticle });
  } catch (error) {
    next(error);
  }
};