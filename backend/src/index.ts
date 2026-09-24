import express from 'express';
import dotenv from 'dotenv';
import { apiRouter } from './api';

dotenv.config();

const app = express();
app.use(express.json());

// Inyectamos las rutas
app.use('/api', apiRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});