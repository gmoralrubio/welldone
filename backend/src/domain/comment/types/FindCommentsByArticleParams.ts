import { Pagination } from '@domain/shared/Pagination';

export type FindCommentsByArticleParams = Pagination & {
  articleId: number;
};
