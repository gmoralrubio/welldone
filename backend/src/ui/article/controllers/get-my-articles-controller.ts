import { Request, Response, NextFunction } from "express";
import { PrismaArticleRepository } from "@infrastructure/article/PrismaArticleRepository";
import { GetMyArticlesUseCase } from "@domain/article/use-cases/get-my-articles";
import { UnauthorizedError } from "@domain/errors/UnauthorizedError";
import { ArticleStatus } from "@domain/article/Article";;

export const getMyArticlesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.authorId) {
      throw new UnauthorizedError("Debes estar autenticado para ver tus artículos");
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;
    

    let status: ArticleStatus | undefined = undefined;
    const rawStatus = req.query.status as string;
    
    if (rawStatus === 'PUBLISHED') status = 'PUBLISHED';
    if (rawStatus === 'DRAFT') status = 'DRAFT';

    const articleRepository = new PrismaArticleRepository();
    const getMyArticlesUseCase = new GetMyArticlesUseCase(articleRepository);

    // Ahora le estamos pasando un Enum real, no un string
    const { articles, total } = await getMyArticlesUseCase.execute(req.authorId, page, limit, status);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      data: articles,
      meta: { page, pages: totalPages, per_page: limit, total_items: total }
    });
  } catch (error) {
    next(error);
  }
};