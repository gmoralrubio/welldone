import { FindCommentsResponse } from '@domain/comment/types/FindCommentsResponse';
import { Comment } from '@domain/comment/Comment';
import { CommentRepository } from '@domain/comment/repositories/CommentRepository';
import { PrismaComment } from '@infrastructure/comment/PrismaComment.types';
import prismaClient from '@infrastructure/shared/prisma-client';
import { FindCommentsByArticleParams } from '@domain/comment/types/FindCommentsByArticleParams';

const commentUserSelect = {
  id: true,
  username: true,
  name: true,
  surname: true,
} as const;

export class PrismaCommentRepository implements CommentRepository {
  private readonly prisma = prismaClient;
  async findComments(
    criteria: FindCommentsByArticleParams
  ): Promise<FindCommentsResponse> {
    const { page, limit, articleId } = criteria;
    // Comentarios parent
    const whereRoots = { articleId, parentId: null };

    const [parentCommentPrisma, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: whereRoots,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: commentUserSelect } },
      }),
      this.prisma.comment.count({ where: whereRoots }),
    ]);

    const repliesByParentId = await this.findReplies(
      articleId,
      parentCommentPrisma.map((parent) => parent.id)
    );

    const comments = parentCommentPrisma.map((parent) =>
      this.restore(
        parent,
        (repliesByParentId.get(parent.id) ?? []).map((reply) => this.restore(reply))
      )
    );

    return {
      comments,
      total,
    };
  }

  private async findReplies(
    articleId: number,
    parentIds: number[]
  ): Promise<Map<number, PrismaComment[]>> {
    const repliesByParentId = new Map<number, PrismaComment[]>();
    if (parentIds.length === 0) return repliesByParentId;

    const replies = await this.prisma.comment.findMany({
      where: { articleId, parentId: { in: parentIds } },
      orderBy: { createdAt: 'asc' },
      include: { user: { select: commentUserSelect } },
    });

    for (const reply of replies) {
      if (reply.parentId === null) continue;

      const siblings = repliesByParentId.get(reply.parentId) ?? [];
      siblings.push(reply);
      repliesByParentId.set(reply.parentId, siblings);
    }

    return repliesByParentId;
  }

  private restore(prismaComment: PrismaComment, children: Comment[] = []): Comment {
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
      children,
    });
  }
}
