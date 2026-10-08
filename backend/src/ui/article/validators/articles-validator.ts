import {
  ARTICLE_MAX_PAGE_SIZE,
  ARTICLE_PAGE_SIZE,
} from '@domain/article/Article';
import { CATEGORY_SLUGS } from '@domain/category/categories';
import { sanitizeArticleContent } from '@infrastructure/article/sanitizers/sanitizeArticleContent';
import { z } from 'zod';

export const findArticlesValidationSchema = z.object({
  page: z.coerce.number('Invalid page. Must be a number').positive().default(1),
  limit: z.coerce
    .number('Invalid limit. Must be a number')
    .positive()
    .max(ARTICLE_MAX_PAGE_SIZE)
    .default(ARTICLE_PAGE_SIZE),
  search: z.string().min(3).optional(),
  category: z.enum(CATEGORY_SLUGS).optional(),
  order: z.enum(['asc', 'desc']).default('desc').catch('desc'),
});

export const articleDetailValidationSchema = z.object({
  authorUsername: z
    .string('Author is required')
    .min(3, 'Minimum author length is 3 characters'),
  slug: z
    .string('Slug is required')
    .min(3, 'Minimum slug length is 3 characters'),
});

export const createArticleValidationSchema = z.object({
  title: z.string().min(2, 'El título debe tener al menos 2 caracteres'),
  content: z
    .string()
    .min(5, 'El contenido debe tener al menos 5 caracteres')
    .transform(sanitizeArticleContent)
    .pipe(z.string().min(5, 'El contenido debe tener al menos 5 caracteres')),
  intro: z
    .string()
    .min(5, 'La introducción es obligatoria, al menos 5 caracteres'),
  slug: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  publishedAt: z.string().optional().nullable(),
  featuredImageUrl: z
    .string()
    .url('Debe ser una URL válida')
    .optional()
    .nullable(),
  featuredVideoUrl: z
    .string()
    .url('Debe ser una URL válida')
    .optional()
    .nullable(),
  categorySlugs: z
    .array(z.enum(CATEGORY_SLUGS))
    .min(1, 'Debes seleccionar al menos una categoría'),
});
