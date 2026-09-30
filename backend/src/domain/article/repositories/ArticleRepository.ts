import { Article, ArticleStatus } from '@domain/article/Article';

export interface CreateArticleParams {
  title: string;
  content: string;
  intro: string;
  slug: string;
  status: ArticleStatus;
  publishedAt: Date;
  featuredImageUrl: string | null;
  featuredVideoUrl: string | null;
  authorId: number;
  categoryIds: number[];
}

export interface ArticleRepository {
  findPublishedByAuthorAndSlug(
    authorUsername: string,
    slug: string
  ): Promise<Article | null>;
  
  create(
    params: CreateArticleParams
  ): Promise<Article>
}
