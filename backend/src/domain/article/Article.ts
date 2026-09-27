import { EntityProps, Entity } from '@domain/shared/Entity.js';

export type ArticleStatus = 'DRAFT' | 'PUBLISHED';

interface ArticleProps extends EntityProps {
  title: string;
  content: string;
  intro: string;
  slug: string;
  status: ArticleStatus;
  publishedAt: Date | null;
  featuredImageUrl: string | null;
  featuredVideoUrl: string | null;
  authorId: number | null;
}

export class Article extends Entity {
  readonly title: string;
  readonly content: string;
  readonly intro: string;
  readonly slug: string;
  readonly status: ArticleStatus;
  readonly publishedAt: Date | null;
  readonly featuredImageUrl: string | null;
  readonly featuredVideoUrl: string | null;
  readonly authorId: number | null;

  constructor(props: ArticleProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });

    this.title = props.title;
    this.content = props.content;
    this.intro = props.intro;
    this.slug = props.slug;
    this.status = props.status;
    this.publishedAt = props.publishedAt;
    this.featuredImageUrl = props.featuredImageUrl;
    this.featuredVideoUrl = props.featuredVideoUrl;
    this.authorId = props.authorId;
  }
}
