import { ArticleStatus } from "@domain/article/Article";
import { ArticleRepository } from "../repositories/ArticleRepository";

export class GetMyArticlesUseCase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(authorId: number, page: number, limit: number, status?: ArticleStatus) {
    return await this.articleRepository.findMyArticles({
      authorId, 
      page, 
      limit, 
      status, 
      order: 'desc'
    });
  }
}