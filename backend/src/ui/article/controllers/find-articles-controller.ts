import { Request, Response, NextFunction } from 'express';
import { EntityNotFoundError } from '@domain/errors/EntityNotFoundError';
import { PrismaArticleRepository } from '@infrastructure/article/PrismaArticleRepository';
import { PrismaUserRepository } from '@infrastructure/user/repositories/PrismaUserRepository';
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
    const { page, limit, search, order, category, authorUsername } =
      findArticlesValidationSchema.parse(req.query);

    let authorId: number | undefined;
    if (authorUsername) {
      const author = await new PrismaUserRepository().findByUsername(authorUsername);
      if (!author) {
        throw new EntityNotFoundError('User', authorUsername);
      }
      authorId = author.id;
    }

    const { articles, total } = await findArticlesUseCase.execute({
      page,
      limit,
      search,
      order,
      category,
      authorId,
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
