import { ArticleStatus } from '@domain/article/Article';

export interface ArticleFilterQuery {
  search?: string;
  category?: string;
  order: 'asc' | 'desc';
  authorId?: number;
}

export type ArticleUserFilterQuery = ArticleFilterQuery & {
  authorId: number;
  status?: ArticleStatus;
};
