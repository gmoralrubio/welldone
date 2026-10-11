import { Request, Response, NextFunction } from 'express';
import { PrismaArticleRepository } from '@infrastructure/article/PrismaArticleRepository';
import { FindMyArticlesUseCase } from '@domain/article/use-cases/find-my-articles';
import { UnauthorizedError } from '@domain/errors/UnauthorizedError';
import { findMyArticlesValidationSchema } from '@ui/article/validators/articles-validator';
import { buildPaginatedResponse } from '@ui/shared/presenters/paginated-response';

export const findMyArticlesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const articleRepository = new PrismaArticleRepository();
  const findUserArticlesUseCase = new FindMyArticlesUseCase(articleRepository);

  try {
    const { page, limit, search, order, category, status } =
      findMyArticlesValidationSchema.parse(req.query);

    if (!req.authorId) {
      throw new UnauthorizedError('Debes estar autenticado para ver tus artículos');
    }

    // Ahora le estamos pasando un Enum real, no un string
    const { articles, total } = await findUserArticlesUseCase.execute({
      authorId: req.authorId,
      page,
      limit,
      search,
      order,
      category,
      status,
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
};
