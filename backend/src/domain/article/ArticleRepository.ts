//Casos de uso (coordinador)

import { Article } from "./Article.js";

export interface ArticleRepository {
  getHelloArticle(): Promise<Article>;
}
