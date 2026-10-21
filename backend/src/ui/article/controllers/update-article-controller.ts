import { NextFunction, Request, Response } from 'express';
import { PrismaArticleRepository } from '@infrastructure/article/PrismaArticleRepository';
import { UpdateArticleUseCase } from '@domain/article/use-cases/update-article';
import { UnauthorizedError } from '@domain/errors/UnauthorizedError';
import {
  articleDetailValidationSchema,
  updateArticleValidationSchema,
} from '@ui/article/validators/articles-validator';

export async function updateArticleController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.authorId) {
      throw new UnauthorizedError('Debes estar autenticado para editar un artículo');
    }

    const { authorUsername, slug } = articleDetailValidationSchema.parse(req.params);
    const updateData = updateArticleValidationSchema.parse(req.body);

    //Conversión de texto a fecha
    const domainData = {
      ...updateData,
      publishedAt: typeof updateData.publishedAt === 'string' 
        ? new Date(updateData.publishedAt) 
        : updateData.publishedAt,
    };

    const articleRepository = new PrismaArticleRepository();
    const updateArticleUseCase = new UpdateArticleUseCase(articleRepository);

    const updatedArticle = await updateArticleUseCase.execute(
      authorUsername,
      slug,
      req.authorId,
      domainData
    );

    res.status(200).json(updatedArticle);
  } catch (error) {
    next(error);
  }
}