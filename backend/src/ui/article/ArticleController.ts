import { ArticleRepository } from '@domain/article/ArticleRepository';

export class ArticleController {
  constructor(private repository: ArticleRepository) {}
}
