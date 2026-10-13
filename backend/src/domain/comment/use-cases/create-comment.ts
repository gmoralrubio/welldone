import { ArticleRepository } from '@domain/article/repositories/ArticleRepository';
import { Comment } from '@domain/comment/Comment';
import { CommentRepository } from '@domain/comment/repositories/CommentRepository';
import { BusinessConflictError } from '@domain/errors/BusinessConflictError';
import { EntityNotFoundError } from '@domain/errors/EntityNotFoundError';

export type CreateCommentUseCaseInput = {
  authorUsername: string;
  slug: string;
  userId: number;
  message: string;
  parentId?: number;
};

export class CreateCommentUseCase {
  readonly commentRepository: CommentRepository;
  readonly articleRepository: ArticleRepository;

  constructor(
    commentRepository: CommentRepository,
    articleRepository: ArticleRepository
  ) {
    this.commentRepository = commentRepository;
    this.articleRepository = articleRepository;
  }

  async execute(input: CreateCommentUseCaseInput): Promise<Comment> {
    const article = await this.articleRepository.findPublishedArticleBy(input);

    if (!article || article.status !== 'PUBLISHED') {
      throw new EntityNotFoundError('Article', input.slug);
    }

    const now = new Date();

    if (article.publishedAt > now) {
      throw new BusinessConflictError('Article has not been published.');
    }

    let parentId: number | null = null;

    if (input.parentId != null) {
      const parent = await this.commentRepository.findById(input.parentId);

      if (!parent || parent.articleId !== article.id) {
        throw new EntityNotFoundError('Comment', input.parentId);
      }

      if (parent.parentId !== null) {
        throw new BusinessConflictError('Replies can only be added to root comments.');
      }

      parentId = parent.id;
    }

    return this.commentRepository.create({
      message: input.message,
      userId: input.userId,
      articleId: article.id,
      parentId,
    });
  }
}
