//Interacción con el usuario (Controladores)

import { Request, Response } from 'express';
import { ArticleRepository } from '../../domain/article/ArticleRepository';

export class ArticleController {
  constructor(private repository: ArticleRepository) {}

  async getHello(req: Request, res: Response) {
    try {
      const article = await this.repository.getHelloArticle();
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: "Error en el servidor" });
    }
  }
}