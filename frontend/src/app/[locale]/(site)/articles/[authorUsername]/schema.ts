import { z } from 'zod';

export const authorUsernameSchema = z
  .string()
  .trim()
  .min(3)
  .regex(/^[a-zA-Z0-9._]+$/);
