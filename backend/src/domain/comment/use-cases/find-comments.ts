import { ArticleRepository } from '@domain/article/repositories/ArticleRepository';
import { FindCommentsResponse } from '@domain/comment/types/FindCommentsResponse';
import { CommentRepository } from '@domain/comment/repositories/CommentRepository';
import { BusinessConflictError } from '@domain/errors/BusinessConflictError';
import { EntityNotFoundError } from '@domain/errors/EntityNotFoundError';
import { Pagination } from '@domain/shared/Pagination';

export type FindCommentsUseCaseInput = Pagination & {
  authorUsername: string;
  slug: string;
};

export class FindCommentsUseCase {
  readonly commentRepository: CommentRepository;
  readonly articleRepository: ArticleRepository;

  constructor(
    commentRepository: CommentRepository,
    articleRepository: ArticleRepository
  ) {
    this.commentRepository = commentRepository;
    this.articleRepository = articleRepository;
  }

  async execute(
    params: FindCommentsUseCaseInput
  ): Promise<FindCommentsResponse> {
    const article = await this.articleRepository.findPublishedByAuthorAndSlug(
      params.authorUsername,
      params.slug
    );

    if (!article) {
      throw new EntityNotFoundError('Article', params.slug);
    }

    const now = new Date();

    if (article.publishedAt > now) {
      throw new BusinessConflictError(`Article has not been published.`);
    }

    return this.commentRepository.findComments(params);
  }
}
