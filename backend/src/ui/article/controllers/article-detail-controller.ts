import { Request, Response, NextFunction } from 'express';
import { PrismaArticleRepository } from '@infrastructure/article/PrismaArticleRepository';
import { FindArticleUseCase } from '@domain/article/use-cases/find-article';
import { articleDetailValidationSchema } from '@ui/article/validators/articles-validator';

export const articleDetailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prismaArticleRepository = new PrismaArticleRepository();
  const findArticleUseCase = new FindArticleUseCase(prismaArticleRepository);
  // TODO: a partir del authorName, obtener el authorID
  try {
    const { authorName, slug } = articleDetailValidationSchema.parse(
      req.params
    );
  } catch {}
};
