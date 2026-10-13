import { CreateCommentParams } from '@domain/comment/types/CreateCommentParams';
import { FindCommentsByArticleParams } from '@domain/comment/types/FindCommentsByArticleParams';
import { FindCommentsResponse } from '@domain/comment/types/FindCommentsResponse';
import { Comment } from '@domain/comment/Comment';

export interface CommentRepository {
  findComments(
    params: FindCommentsByArticleParams
  ): Promise<FindCommentsResponse>;
  create(params: CreateCommentParams): Promise<Comment>;
  findById(id: number): Promise<Comment | null>;
}
