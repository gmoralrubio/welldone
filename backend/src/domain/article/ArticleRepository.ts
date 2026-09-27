import { Article } from '@domain/article/Article';

export interface ArticleRepository {
  findPublishedByAuthorAndSlug(
    authorId: number,
    slug: string
  ): Promise<Article | null>;
}
