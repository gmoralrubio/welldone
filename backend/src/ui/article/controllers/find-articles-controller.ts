import { Request, Response, NextFunction } from 'express';
import { PrismaArticleRepository } from '@infrastructure/article/PrismaArticleRepository';
import { FindArticleDetailUseCase } from '@domain/article/use-cases/find-article-detail';
import { findArticlesValidationSchema } from '@ui/article/validators/articles-validator';
import { FindPublishedArticlesUseCase } from '@domain/article/use-cases/find-published-articles';
import { buildPaginatedResponse } from '@ui/shared/presenters/paginated-response';

export const findPublishedArticlesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prismaArticleRepository = new PrismaArticleRepository();
  const findArticlesUseCase = new FindPublishedArticlesUseCase(
    prismaArticleRepository
  );

  try {
    const { page, limit, search } = findArticlesValidationSchema.parse(
      req.query
    );

    const { articles, total } = await findArticlesUseCase.execute({
      page,
      limit,
      search,
    });

    const url = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

    const response = buildPaginatedResponse({
      data: articles,
      total,
      page,
      limit,
      url,
    });
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
