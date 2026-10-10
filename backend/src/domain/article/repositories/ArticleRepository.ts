import { Article } from '@domain/article/Article';
import { FindArticlesResponse } from '@domain/article/types/FindArticlesResponse';
import { CreateArticleUseCaseInput } from '@domain/article/use-cases/create-article';
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

  create(criteria: CreateArticleUseCaseInput): Promise<Article>;
}
