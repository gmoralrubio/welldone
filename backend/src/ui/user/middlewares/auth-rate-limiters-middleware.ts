import { rateLimit } from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: 'Demasiados intentos de inicio de sesión. Inténtalo más tarde.',
  },
});
