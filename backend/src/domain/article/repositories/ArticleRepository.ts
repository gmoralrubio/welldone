import { Article } from '@domain/article/Article';

export interface ArticleRepository {
  findPublishedByAuthorAndSlug(
    authorUsername: string,
    slug: string
  ): Promise<Article | null>;
}
