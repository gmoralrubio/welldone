import { FindCommentsResponse } from '@domain/comment/types/FindCommentsResponse';
import { FindCommentsUseCaseInput } from '@domain/comment/use-cases/find-comments';

export interface CommentRepository {
  findComments(
    criteria: FindCommentsUseCaseInput
  ): Promise<FindCommentsResponse>;
}
