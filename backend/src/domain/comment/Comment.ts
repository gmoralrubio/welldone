import { EntityProps, Entity } from '@domain/shared/Entity.js';

interface CommentProps extends EntityProps {
  message: string;
  userId: number;
  articleId: number;
  parentId: number | null;
}

export class Comment extends Entity {
  readonly message: string;
  readonly userId: number;
  readonly articleId: number;
  readonly parentId: number | null;

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
  }
}
