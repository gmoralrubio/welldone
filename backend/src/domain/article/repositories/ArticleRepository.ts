import { Article } from '@domain/article/Article';

export interface ArticleRepository {
  findPublishedByAuthorAndSlug(
    authorName: string,
    slug: string
  ): Promise<Article | null>;
}
