import express from 'express';

const api = express();

api.use(express.json());

api.use('/articles', articlesRouter);

export default api;
