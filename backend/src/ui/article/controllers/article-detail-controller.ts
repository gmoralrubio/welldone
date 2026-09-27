import { Request, Response, NextFunction } from 'express';
import { PrismaArticleRepository } from '@infrastructure/article/PrismaArticleRepository';

export const articleDetailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Crear dependencias
  const prismaArticleRepository = new PrismaArticleRepository();
};
