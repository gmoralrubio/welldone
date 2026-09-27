import { z } from 'zod';

export const articleDetailValidationSchema = z.object({
  author: z
    .string('Author is required')
    .min(3, 'Minimum author length is 3 characters'),
});
