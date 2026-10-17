import { NextFunction, Request, Response } from 'express';
import { PrismaArticleRepository } from '@infrastructure/article/PrismaArticleRepository';
import { DeleteArticleUseCase } from '@domain/article/use-cases/delete-article';
import { UnauthorizedError } from '@domain/errors/UnauthorizedError';
import { articleIdParamSchema } from '@ui/article/validators/articles-validator';

export async function deleteArticleController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.authorId) {
      throw new UnauthorizedError('Debes estar autenticado para eliminar un artículo');
    }

    const { id } = articleIdParamSchema.parse(req.params);

    const articleRepository = new PrismaArticleRepository();
    const deleteArticleUseCase = new DeleteArticleUseCase(articleRepository);

    await deleteArticleUseCase.execute(id, req.authorId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}