import { Article } from '@domain/article/Article';
import { CreateArticleParams } from '@domain/article/types/CreateArticleParams';
import { FindArticlesResponse } from '@domain/article/types/FindArticlesResponse';
import { FindPublishedArticlesUseCaseInput } from '@domain/article/use-cases/find-published-articles';
import { FindUserArticlesUseCaseInput } from '@domain/article/use-cases/find-user-articles';

export interface ArticleRepository {
  findPublishedArticles(
    criteria: FindPublishedArticlesUseCaseInput
  ): Promise<FindArticlesResponse>;
  findUserArticles(
    criteria: FindUserArticlesUseCaseInput
  ): Promise<FindArticlesResponse>;
  findPublishedByAuthorAndSlug(
    authorUsername: string,
    slug: string
  ): Promise<Article | null>;

  create(params: CreateArticleParams): Promise<Article>;
}
