import { type EntityProps, Entity } from "../shared/Entity.js";

type ArticleStatus = "DRAFT" | "PUBLISHED";

interface ArticleProps extends EntityProps {
  title: string;
  content: string;
  intro: string;
  slug: string;
  status: ArticleStatus;
  featuredImageUrl: string;
  featuredVideoUrl: string;
}

export class Article extends Entity {
  readonly title: string;
  readonly content: string;
  readonly intro: string;
  readonly slug: string;
  readonly status: ArticleStatus;
  readonly featuredImageUrl: string;
  readonly featuredVideoUrl: string;

  constructor(props: ArticleProps) {
    super(props);

    this.title = props.title;
    this.content = props.content;
    this.intro = props.intro;
    this.slug = props.slug;
    this.status = props.status;
    this.featuredImageUrl = props.featuredImageUrl;
    this.featuredVideoUrl = props.featuredVideoUrl;
  }
}
