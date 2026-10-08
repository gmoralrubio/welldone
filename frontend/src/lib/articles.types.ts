import type { CategorySlug } from '@/app/[locale]/category/category.types';

export enum ArticleStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

type ArticleCategories = {
  id: number;
  name: string;
  slug: CategorySlug;
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
