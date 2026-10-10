import { Comment } from '@domain/comment/Comment';

export interface FindCommentsResponse {
  comments: Comment[];
  total: number;
}
