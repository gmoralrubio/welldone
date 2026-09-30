export enum ArticleStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export type ArticleDto = {
  id: string;
  title: string;
  content: string;
  intro: string;
  slug: string;
  status: ArticleStatus;
  publishedAt: string;
  featuredImageUrl: string | null;
  featuredVideoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    surname: string;
    username: string;
  };
};
