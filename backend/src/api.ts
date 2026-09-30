import express, { Request, Response } from 'express';
import { userRouter } from './ui/user/routes/user-route.js';
import { articlesRouter } from '@ui/article/routes/articles-routes';

const api = express();
const router = express.Router();

router.use(express.json());

api.use('/api', router);

router.use('/users', userRouter);
router.use('/articles', articlesRouter);

router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// TODO: implementar src/ui/shared/middlewares/error-handler-middleware.ts

// api.use(errorHandlerMiddleware);

export default api;
