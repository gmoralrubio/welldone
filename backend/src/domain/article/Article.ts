import { EntityProps, Entity } from '@domain/shared/Entity.js';

export type ArticleStatus = 'DRAFT' | 'PUBLISHED';

export interface ArticleAuthor {
  id: number;
  name: string;
  surname: string;
  username: string;
}

interface ArticleProps extends EntityProps {
  title: string;
  content: string;
  intro: string;
  slug: string;
  status: ArticleStatus;
  publishedAt: Date;
  featuredImageUrl: string | null;
  featuredVideoUrl: string | null;
  authorId: number;
  author: ArticleAuthor;
}

export class Article extends Entity {
  readonly title: string;
  readonly content: string;
  readonly intro: string;
  readonly slug: string;
  readonly status: ArticleStatus;
  readonly publishedAt: Date;
  readonly featuredImageUrl: string | null;
  readonly featuredVideoUrl: string | null;
  readonly authorId: number;
  readonly author: ArticleAuthor;

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
    this.author = props.author;
  }
}
