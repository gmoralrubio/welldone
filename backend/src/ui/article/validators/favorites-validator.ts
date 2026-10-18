import { ARTICLE_MAX_PAGE_SIZE, ARTICLE_PAGE_SIZE } from '@ui/article/validators/articles-validator';
import { z } from 'zod';

export const saveFavoriteParamsSchema = z.object({
  authorUsername: z
    .string('Author is required')
    .min(3, 'Minimum author length is 3 characters'),
  slug: z.string('Slug is required').min(3, 'Minimum slug length is 3 characters'),
});

export const findMyFavoritesQuerySchema = z.object({
  page: z.coerce.number('Invalid page. Must be a number').int().positive().default(1),
  limit: z.coerce
    .number('Invalid limit. Must be a number')
    .int()
    .positive()
    .max(ARTICLE_MAX_PAGE_SIZE)
    .default(ARTICLE_PAGE_SIZE),
});
