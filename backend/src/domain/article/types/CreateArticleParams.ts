import { ArticleStatus } from '@domain/article/Article';
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
