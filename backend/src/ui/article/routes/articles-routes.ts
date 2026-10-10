import { articleDetailController } from '@ui/article/controllers/article-detail-controller';
import { findPublishedArticlesController } from '@ui/article/controllers/find-articles-controller';
import { Router } from 'express';
import { createArticleController } from '@ui/article/controllers/create-article-controller';
import { authenticationMiddleware } from '@ui/user/middlewares/authentication-middleware';
import { findUserArticlesController } from '../controllers/find-user-articles-controller';

export const articlesRouter = Router();

articlesRouter.get('/', findPublishedArticlesController);

articlesRouter.get('/me', authenticationMiddleware, findUserArticlesController);

// Detalle artículo por authorName y slug
articlesRouter.get('/:authorUsername/:slug', articleDetailController);

//Ruta restringida (Requiere token)
articlesRouter.post('/', authenticationMiddleware, createArticleController);
