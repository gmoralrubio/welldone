import { FindFavoritesUseCase } from '@domain/favorite/use-cases/find-favorites';
import { UnauthorizedError } from '@domain/errors/UnauthorizedError';
import { PrismaFavoriteRepository } from '@infrastructure/favorite/PrismaFavoriteRepository';
import { findFavoritesQuerySchema } from '@ui/article/validators/favorites-validator';
import { buildPaginatedResponse } from '@ui/shared/presenters/paginated-response';
import { NextFunction, Request, Response } from 'express';

export async function findFavoritesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.authorId) {
      throw new UnauthorizedError('Debes estar autenticado para ver tus favoritos');
    }

    const { page, limit } = findFavoritesQuerySchema.parse(req.query);

    const findFavoritesUseCase = new FindFavoritesUseCase(new PrismaFavoriteRepository());

    const { articles, total } = await findFavoritesUseCase.execute({
      userId: req.authorId,
      page,
      limit,
    });

    const response = buildPaginatedResponse({
      data: articles,
      total,
      page,
      limit,
    });

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}
