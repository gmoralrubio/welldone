export enum ArticleStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export const articleCategories = [
  { id: 1, name: 'Desarrollo Web' },
  { id: 2, name: 'Arquitectura de Software' },
  { id: 3, name: 'Diseño UX/UI' },
  { id: 4, name: 'DevOps' },
  { id: 5, name: 'Inteligencia Artificial' },
  { id: 6, name: 'Seguridad Informática' },
];

type ArticleCategories = {
  id: number;
  name: string;
  slug: string;
};

type ArticleAuthor = {
  id: number;
  name: string;
  surname: string;
  username: string;
};

export type ArticleDto = {
  id: number;
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
  author: ArticleAuthor;
  categories: ArticleCategories[];
};
