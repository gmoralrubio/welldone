import { Request, Response, NextFunction } from 'express';
import { PrismaArticleRepository } from '@infrastructure/article/PrismaArticleRepository';
import { FindMyArticleUseCase } from '@domain/article/use-cases/find-my-article';
import { myArticleValidationSchema } from '@ui/article/validators/articles-validator';

export const findMyArticleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const articleRepository = new PrismaArticleRepository();
  const findMyArticleUseCase = new FindMyArticleUseCase(articleRepository);

  try {
    const { slug, authorId } = myArticleValidationSchema.parse({
      ...req.params,
      authorId: req.authorId,
    });

    const article = await findMyArticleUseCase.execute({
      authorId,
      slug,
    });

    res.status(200).json({ article });
  } catch (error) {
    next(error);
  }
};
