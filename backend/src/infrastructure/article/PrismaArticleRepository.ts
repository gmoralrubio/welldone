
//Infraestructura (programas para ejecutar los casos de uso)

import { PrismaClient } from '@prisma/client';
import { ArticleRepository } from '../../domain/article/ArticleRepository';
import { Article } from '../../domain/article/Article';

const prisma = new PrismaClient();

export class PrismaArticleRepository implements ArticleRepository {
  async getHelloArticle(): Promise<Article> {
    
    const firstArticle = await prisma.article.findFirst();
    
    if (firstArticle) {
      return new Article(firstArticle.id, firstArticle.title, firstArticle.content);
    }
    
    return new Article(0, "Hello World", "Comunicación Hexagonal Exitosa");
  }
}