import { articleDetailController } from '@ui/article/controllers/article-detail-controller';
import { Router } from 'express';

export const articlesRouter = Router();

// Detalle artículo por authorName y slug
articlesRouter.get('/:authorUsername/:slug', articleDetailController);
