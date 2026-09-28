import { z } from 'zod';

export const articleDetailValidationSchema = z.object({
  authorName: z
    .string('Author is required')
    .min(3, 'Minimum author length is 3 characters'),
  slug: z
    .string('Slug is required')
    .min(3, 'Minimum slug length is 3 characters'),
});
