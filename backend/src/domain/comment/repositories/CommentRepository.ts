import { FindCommentsByArticleParams } from '@domain/comment/types/FindCommentsByArticleParams';
import { FindCommentsResponse } from '@domain/comment/types/FindCommentsResponse';

export interface CommentRepository {
  findComments(
    params: FindCommentsByArticleParams
  ): Promise<FindCommentsResponse>;
}
