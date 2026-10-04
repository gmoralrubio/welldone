import { articleDetailController } from '@ui/article/controllers/article-detail-controller';
import { findPublishedArticlesController } from '@ui/article/controllers/find-articles-controller';
import { Router } from 'express';
import { createArticleController } from '@ui/article/controllers/create-article-controller';
import { authenticationMiddleware } from '@ui/user/middlewares/authentication-middleware';

export const articlesRouter = Router();

articlesRouter.get('/', findPublishedArticlesController);
// Detalle artículo por authorName y slug
articlesRouter.get('/:authorUsername/:slug', articleDetailController);

//Ruta restringida (Requiere token)
articlesRouter.post('/', authenticationMiddleware, createArticleController);