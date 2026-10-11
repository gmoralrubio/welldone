import { articleDetailController } from '@ui/article/controllers/article-detail-controller';
import { findPublishedArticlesController } from '@ui/article/controllers/find-articles-controller';
import { Router } from 'express';
import { createArticleController } from '@ui/article/controllers/create-article-controller';
import { authenticationMiddleware } from '@ui/user/middlewares/authentication-middleware';
import { findMyArticlesController } from '../controllers/find-my-articles-controller';
import { articleCommentsController } from '@ui/article/controllers/article-comments-controller';

export const articlesRouter = Router();

articlesRouter.get('/', findPublishedArticlesController);
articlesRouter.post('/', authenticationMiddleware, createArticleController);
articlesRouter.get('/me', authenticationMiddleware, findMyArticlesController);

articlesRouter.get('/:authorUsername/:slug', articleDetailController);
articlesRouter.get('/:authorUsername/:slug/comments', articleCommentsController);
