import { Article } from '@domain/article/Article';

export interface FindFavoritesResponse {
  articles: Article[];
  total: number;
}
