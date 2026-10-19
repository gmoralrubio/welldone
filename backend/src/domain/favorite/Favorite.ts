import { Entity, EntityProps } from '@domain/shared/Entity';

interface FavoriteProps extends EntityProps {
  userId: number;
  articleId: number;
}

export class Favorite extends Entity {
  readonly userId: number;
  readonly articleId: number;
  constructor(props: FavoriteProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
    this.userId = props.userId;
    this.articleId = props.articleId;
  }
}
