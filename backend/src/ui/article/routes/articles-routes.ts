import { articleDetailController } from '@ui/article/controllers/article-detail-controller';
import { Router } from 'express';
import { createArticleController } from '@ui/article/controllers/create-article-controller';
import { authenticationMiddleware } from '@ui/user/middlewares/authentication-middleware';

export const articlesRouter = Router();

// Detalle artículo por authorName y slug
articlesRouter.get('/:authorUsername/:slug', articleDetailController);

//Ruta restringida (Requiere token)
articlesRouter.post('/', authenticationMiddleware, createArticleController);