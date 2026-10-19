import { RemoveFavoriteUseCase } from '@domain/favorite/use-cases/remove-favorite';
import { UnauthorizedError } from '@domain/errors/UnauthorizedError';
import { PrismaArticleRepository } from '@infrastructure/article/PrismaArticleRepository';
import { PrismaFavoriteRepository } from '@infrastructure/favorite/PrismaFavoriteRepository';
import { saveFavoriteParamsSchema } from '@ui/article/validators/favorites-validator';
import { NextFunction, Request, Response } from 'express';

export async function removeFavoriteController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.authorId) {
      throw new UnauthorizedError(
        'Debes estar autenticado para quitar un artículo de favoritos'
      );
    }

    const { authorUsername, slug } = saveFavoriteParamsSchema.parse(req.params);

    const removeFavoriteUseCase = new RemoveFavoriteUseCase(
      new PrismaFavoriteRepository(),
      new PrismaArticleRepository()
    );

    await removeFavoriteUseCase.execute({
      userId: req.authorId,
      authorUsername,
      slug,
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
