import {
  ARTICLE_MAX_PAGE_SIZE,
  ARTICLE_PAGE_SIZE,
} from '@ui/article/validators/articles-validator';
import { z } from 'zod';

export const saveFavoriteParamsSchema = z.object({
  authorUsername: z
    .string('Author is required')
    .min(3, 'Minimum author length is 3 characters'),
  slug: z.string('Slug is required').min(3, 'Minimum slug length is 3 characters'),
});

const favoriteArticleIdsSchema = z
  .union([z.string(), z.array(z.string())])
  .transform((value) =>
    (Array.isArray(value) ? value : [value])
      .flatMap((item) => item.split(','))
      .map((part) => part.trim())
      .filter((part) => part.length > 0)
      .map((part) => Number(part))
  )
  .refine(
    (ids) =>
      ids.length <= ARTICLE_MAX_PAGE_SIZE &&
      ids.every((id) => Number.isInteger(id) && id > 0),
    'Invalid article ids'
  );

export const findFavoritesQuerySchema = z.object({
  page: z.coerce.number('Invalid page. Must be a number').int().positive().default(1),
  limit: z.coerce
    .number('Invalid limit. Must be a number')
    .int()
    .positive()
    .max(ARTICLE_MAX_PAGE_SIZE)
    .default(ARTICLE_PAGE_SIZE),
  articleIds: favoriteArticleIdsSchema.optional(),
});
