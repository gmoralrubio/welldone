import { ArticleStatus } from "@domain/article/Article";
import { ArticleRepository } from "../repositories/ArticleRepository";

export class GetMyArticlesUseCase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(authorId: number, page: number, limit: number, status?: ArticleStatus) {
    const skip = (page - 1) * limit;
    return await this.articleRepository.findMyArticles(authorId, skip, limit, status);
  }
}