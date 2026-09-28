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
  try {
    const { authorName, slug } = articleDetailValidationSchema.parse(
      req.params
    );

    const article = await findArticleUseCase.execute({ authorName, slug });

    res.status(200).json({ article });
  } catch (error) {
    next(error);
  }
};
