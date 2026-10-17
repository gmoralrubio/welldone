import { Article } from '@domain/article/Article';
import { FindArticlesResponse } from '@domain/article/types/FindArticlesResponse';
import { CreateArticleUseCaseInput } from '@domain/article/use-cases/create-article';
import { FindPublishedArticlesUseCaseInput } from '@domain/article/use-cases/find-published-articles';
import { FindMyArticlesUseCaseInput } from '@domain/article/use-cases/find-my-articles';
import { FindMyArticleUseCaseInput } from '@domain/article/use-cases/find-my-article';
import { FindArticleDetailUseCaseInput } from '@domain/article/use-cases/find-article-detail';
import { UpdateArticleUseCaseInput } from '@domain/article/use-cases/update-article';

export interface ArticleRepository {
  findPublishedArticles(
    criteria: FindPublishedArticlesUseCaseInput
  ): Promise<FindArticlesResponse>;
  findMyArticles(
    criteria: FindMyArticlesUseCaseInput
  ): Promise<FindArticlesResponse>;
  findPublishedArticleByAuthorAndSlug(
    criteria: FindArticleDetailUseCaseInput
  ): Promise<Article | null>;
  findArticleByIdAndSlug(
    criteria: FindMyArticleUseCaseInput
  ): Promise<Article | null>;
  create(
    criteria: CreateArticleUseCaseInput
  ): Promise<Article>;
  findById(
    id: number
  ): Promise<Article | null>;
  update(
    id: number, data: UpdateArticleUseCaseInput
  ): Promise<Article>;

  findByTitleAndAuthor(
    title: string, authorId: number
  ): Promise<Article | null>;
  
  delete(id: number): Promise<void>;
}