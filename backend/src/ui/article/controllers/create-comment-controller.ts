import { CreateCommentUseCase } from '@domain/comment/use-cases/create-comment';
import { UnauthorizedError } from '@domain/errors/UnauthorizedError';
import { PrismaArticleRepository } from '@infrastructure/article/PrismaArticleRepository';
import { PrismaCommentRepository } from '@infrastructure/comment/PrismaCommentRepository';
import {
  createCommentValidationSchema,
  findCommentValidationSchema,
} from '@ui/article/validators/comments-validator';
import { NextFunction, Request, Response } from 'express';

export async function createCommentController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.authorId) {
      throw new UnauthorizedError('Debes estar autenticado para comentar un artículo');
    }

    const { authorUsername, slug } = findCommentValidationSchema.parse(req.params);
    const { message, parentId } = createCommentValidationSchema.parse(req.body);

    const commentRepository = new PrismaCommentRepository();
    const articleRepository = new PrismaArticleRepository();
    const createCommentUseCase = new CreateCommentUseCase(
      commentRepository,
      articleRepository
    );

    const comment = await createCommentUseCase.execute({
      authorUsername,
      slug,
      userId: req.authorId,
      message,
      parentId,
    });

    res.status(201).json({ comment });
  } catch (error) {
    next(error);
  }
}
