import express, { Request, Response } from 'express';

const api = express();

api.use(express.json());

// api.use('/articles', articlesRouter);

api.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// TODO: implementar src/ui/shared/middlewares/error-handler-middleware.ts
// api.use(errorHandlerMiddleware);

export default api;
