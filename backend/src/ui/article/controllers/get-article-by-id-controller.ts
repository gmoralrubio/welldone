import { NextFunction, Request, Response } from 'express';
import { PrismaArticleRepository } from '@infrastructure/article/PrismaArticleRepository';
import { FindArticleByIdUseCase } from '@domain/article/use-cases/find-article-by-id';
import { articleIdParamSchema } from '@ui/article/validators/articles-validator';

export async function getArticleByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = articleIdParamSchema.parse(req.params);

    const articleRepository = new PrismaArticleRepository();
    const findArticleByIdUseCase = new FindArticleByIdUseCase(articleRepository);

    const article = await findArticleByIdUseCase.execute(id);

    res.status(200).json(article);
  } catch (error) {
    next(error);
  }
}