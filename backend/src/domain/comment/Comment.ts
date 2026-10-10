import { EntityProps, Entity } from '@domain/shared/Entity.js';

interface CommentUser {
  id: number;
  name: string;
  surname: string;
  username: string;
}

interface CommentProps extends EntityProps {
  message: string;
  userId: number;
  articleId: number;
  parentId: number | null;
  user: CommentUser;
}

export class Comment extends Entity {
  readonly message: string;
  readonly userId: number;
  readonly articleId: number;
  readonly parentId: number | null;
  readonly user: CommentUser;

  constructor(props: CommentProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
    this.message = props.message;
    this.userId = props.userId;
    this.articleId = props.articleId;
    this.parentId = props.parentId;
    this.user = props.user;
  }
}
