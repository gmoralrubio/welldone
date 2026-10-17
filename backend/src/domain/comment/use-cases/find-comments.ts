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

  async execute(criteria: FindCommentsUseCaseInput): Promise<FindCommentsResponse> {
    const article = await this.articleRepository.findPublishedArticleByAuthorAndSlug(criteria);

    if (!article || article.status !== 'PUBLISHED') {
      throw new EntityNotFoundError('Article', criteria.slug);
    }

    const now = new Date();

    if (article.publishedAt > now) {
      throw new BusinessConflictError(`Article has not been published.`);
    }

    return this.commentRepository.findComments({
      articleId: article.id,
      page: criteria.page,
      limit: criteria.limit,
    });
  }
}
