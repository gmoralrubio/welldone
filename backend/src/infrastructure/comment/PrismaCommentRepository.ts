import { FindCommentsResponse } from '@domain/comment/types/FindCommentsResponse';
import { Comment } from '@domain/comment/Comment';
import { CommentRepository } from '@domain/comment/repositories/CommentRepository';
import { PrismaComment } from '@infrastructure/comment/PrismaComment.types';
import prismaClient from '@infrastructure/shared/prisma-client';
import { FindCommentsByArticleParams } from '@domain/comment/types/FindCommentsByArticleParams';

export class PrismaCommentRepository implements CommentRepository {
  private readonly prisma = prismaClient;
  async findComments(
    criteria: FindCommentsByArticleParams
  ): Promise<FindCommentsResponse> {
    const { page, limit, articleId } = criteria;
    const where = { articleId };

    const [commentsPrisma, commentsCount] = await Promise.all([
      this.prisma.comment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              surname: true,
            },
          },
        },
      }),
      this.prisma.comment.count({ where }),
    ]);
    const comments = commentsPrisma.map((comment) => this.restore(comment));

    return {
      comments,
      total: commentsCount,
    };
  }

  private restore(prismaComment: PrismaComment): Comment {
    return new Comment({
      id: prismaComment.id,
      message: prismaComment.message,
      userId: prismaComment.userId,
      articleId: prismaComment.articleId,
      parentId: prismaComment.parentId,
      createdAt: prismaComment.createdAt,
      updatedAt: prismaComment.updatedAt,
      user: {
        id: prismaComment.user.id,
        name: prismaComment.user.name,
        surname: prismaComment.user.surname,
        username: prismaComment.user.username,
      },
    });
  }
}
