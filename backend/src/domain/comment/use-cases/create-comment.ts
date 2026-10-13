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

    return this.commentRepository.create({
      message: input.message,
      userId: input.userId,
      articleId: article.id,
      parentId: null,
    });
  }
}
