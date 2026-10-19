import { SaveFavoriteUseCase } from '@domain/favorite/use-cases/save-favorite';
import { UnauthorizedError } from '@domain/errors/UnauthorizedError';
import { PrismaArticleRepository } from '@infrastructure/article/PrismaArticleRepository';
import { PrismaFavoriteRepository } from '@infrastructure/favorite/PrismaFavoriteRepository';
import { saveFavoriteParamsSchema } from '@ui/article/validators/favorites-validator';
import { NextFunction, Request, Response } from 'express';

export async function saveFavoriteController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.authorId) {
      throw new UnauthorizedError('Debes estar autenticado para guardar un artículo como favorito');
    }

    const { authorUsername, slug } = saveFavoriteParamsSchema.parse(req.params);

    const saveFavoriteUseCase = new SaveFavoriteUseCase(
      new PrismaFavoriteRepository(),
      new PrismaArticleRepository()
    );

    const { favorite, created } = await saveFavoriteUseCase.execute({
      userId: req.authorId,
      authorUsername,
      slug,
    });

    res.status(created ? 201 : 200).json({ favorite });
  } catch (error) {
    next(error);
  }
}
