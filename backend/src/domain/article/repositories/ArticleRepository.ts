import { Article, ArticleStatus } from '@domain/article/Article';
import { FindArticlesResponse } from '@domain/article/types/FindArticlesResponse';
import { FindPublishedArticlesUseCaseInput } from '@domain/article/use-cases/find-published-articles';
import { CategorySlug } from '@domain/category/categories';


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
  categorySlugs: CategorySlug[];
}

export interface ArticleRepository {
  findPublishedArticles(
    criteria: FindPublishedArticlesUseCaseInput
  ): Promise<FindArticlesResponse>;
  findPublishedByAuthorAndSlug(
    authorUsername: string,
    slug: string
  ): Promise<Article | null>;

  create(params: CreateArticleParams): Promise<Article>;

  findMyArticles(
    authorId: number, 
    skip: number, 
    take: number, 
    status?: ArticleStatus 
  ): Promise<{ articles: Article[]; total: number }>;

}