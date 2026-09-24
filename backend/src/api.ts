import { Router } from 'express';
import { PrismaArticleRepository } from './infrastructure/article/PrismaArticleRepository';
import { ArticleController } from './ui/article/ArticleController';

export const apiRouter = Router();

const articleRepository = new PrismaArticleRepository();
const articleController = new ArticleController(articleRepository);


apiRouter.get('/hello', (req, res) => articleController.getHello(req, res));