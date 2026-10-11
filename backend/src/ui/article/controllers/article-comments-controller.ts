import { FindCommentsUseCase } from '@domain/comment/use-cases/find-comments';
import { PrismaArticleRepository } from '@infrastructure/article/PrismaArticleRepository';
import { PrismaCommentRepository } from '@infrastructure/comment/PrismaCommentRepository';
import {
  commentPaginationValidationSchema,
  findCommentValidationSchema,
} from '@ui/article/validators/comments-validator';
import { buildPaginatedResponse } from '@ui/shared/presenters/paginated-response';
import { Request, Response, NextFunction } from 'express';
export async function articleCommentsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const prismaCommentRepository = new PrismaCommentRepository();
  const prismaArticleRepository = new PrismaArticleRepository();
  const findCommentsUseCase = new FindCommentsUseCase(
    prismaCommentRepository,
    prismaArticleRepository
  );

  try {
    const { authorUsername, slug } = findCommentValidationSchema.parse(
      req.params
    );
    const { page, limit } = commentPaginationValidationSchema.parse(req.query);

    const { comments, total } = await findCommentsUseCase.execute({
      authorUsername,
      slug,
      page,
      limit,
    });

    const response = buildPaginatedResponse({
      data: comments,
      total,
      page,
      limit,
    });
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}
