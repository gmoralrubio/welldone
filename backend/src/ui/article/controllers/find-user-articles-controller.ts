import { Request, Response, NextFunction } from 'express';
import { PrismaArticleRepository } from '@infrastructure/article/PrismaArticleRepository';
import { FindUserArticlesUseCase } from '@domain/article/use-cases/find-user-articles';
import { UnauthorizedError } from '@domain/errors/UnauthorizedError';
import { findArticlesUserValidationSchema } from '@ui/article/validators/articles-validator';
import { buildPaginatedResponse } from '@ui/shared/presenters/paginated-response';

export const findUserArticlesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const articleRepository = new PrismaArticleRepository();
  const findUserArticlesUseCase = new FindUserArticlesUseCase(
    articleRepository
  );

  try {
    const { page, limit, search, order, category, status } =
      findArticlesUserValidationSchema.parse(req.query);

    if (!req.authorId) {
      throw new UnauthorizedError(
        'Debes estar autenticado para ver tus artículos'
      );
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
