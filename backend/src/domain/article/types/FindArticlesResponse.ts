import { Article } from '@domain/article/Article';

export interface FindArticlesResponse {
  articles: Article[];
  total: number;
}
