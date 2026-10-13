import { Article } from '@domain/article/Article';
import { FindArticlesResponse } from '@domain/article/types/FindArticlesResponse';
import { CreateArticleUseCaseInput } from '@domain/article/use-cases/create-article';
import { FindPublishedArticlesUseCaseInput } from '@domain/article/use-cases/find-published-articles';
import { FindMyArticlesUseCaseInput } from '@domain/article/use-cases/find-my-articles';
import { FindMyArticleUseCaseInput } from '@domain/article/use-cases/find-my-article';
import { FindArticleDetailUseCaseInput } from '@domain/article/use-cases/find-article-detail';

export interface ArticleRepository {
  findPublishedArticles(
    criteria: FindPublishedArticlesUseCaseInput
  ): Promise<FindArticlesResponse>;
  findMyArticles(criteria: FindMyArticlesUseCaseInput): Promise<FindArticlesResponse>;
  findPublishedArticleBy(
    criteria: FindArticleDetailUseCaseInput
  ): Promise<Article | null>;
  findArticleBy(criteria: FindMyArticleUseCaseInput): Promise<Article | null>;

  create(criteria: CreateArticleUseCaseInput): Promise<Article>;
}
