import { Request, Response, NextFunction } from 'express';
import { PrismaArticleRepository } from '@infrastructure/article/PrismaArticleRepository';
import { FindArticleDetailUseCase } from '@domain/article/use-cases/find-article-detail';
import { articleDetailValidationSchema } from '@ui/article/validators/articles-validator';

export const articleDetailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prismaArticleRepository = new PrismaArticleRepository();
  const findArticleUseCase = new FindArticleDetailUseCase(
    prismaArticleRepository
  );
  try {
    const { authorUsername, slug } = articleDetailValidationSchema.parse(
      req.params
    );

    const article = await findArticleUseCase.execute({ authorUsername, slug });
    res.status(200).json({ article });
  } catch (error) {
    next(error);
  }
};
