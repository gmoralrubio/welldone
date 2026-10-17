import { articleDetailController } from '@ui/article/controllers/article-detail-controller';
import { findPublishedArticlesController } from '@ui/article/controllers/find-articles-controller';
import { Router } from 'express';
import { createArticleController } from '@ui/article/controllers/create-article-controller';
import { authenticationMiddleware } from '@ui/user/middlewares/authentication-middleware';
import { findMyArticlesController } from '../controllers/find-my-articles-controller';
import { findMyArticleController } from '../controllers/find-my-article-controller';
import { articleCommentsController } from '@ui/article/controllers/article-comments-controller';
import { createCommentController } from '@ui/article/controllers/create-comment-controller';
import { getArticleByIdController } from '../controllers/get-article-by-id-controller';
import { updateArticleController } from '../controllers/update-article-controller';

export const articlesRouter = Router();


articlesRouter.get('/', findPublishedArticlesController);
articlesRouter.post('/', authenticationMiddleware, createArticleController);
articlesRouter.get('/me', authenticationMiddleware, findMyArticlesController);
articlesRouter.get('/me/:slug', authenticationMiddleware, findMyArticleController);

articlesRouter.get('/:id', getArticleByIdController);
articlesRouter.patch('/:id', authenticationMiddleware, updateArticleController);

articlesRouter.get('/:authorUsername/:slug', articleDetailController);
articlesRouter.get('/:authorUsername/:slug/comments', articleCommentsController);
articlesRouter.post(
  '/:authorUsername/:slug/comments',
  authenticationMiddleware,
  createCommentController
);
