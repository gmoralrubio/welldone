//Casos de uso (coordinador)

import { Article } from "./Article";

export interface ArticleRepository {
  getHelloArticle(): Promise<Article>;
}