import { CATEGORY_SLUGS } from '@domain/category/categories';
import { sanitizeArticleContent } from '@infrastructure/article/sanitizers/sanitizeArticleContent';
import { z } from 'zod';
export const ARTICLE_PAGE_SIZE = 6;
export const ARTICLE_MAX_PAGE_SIZE = 12;

const ALLOWED_IMAGE_DOMAINS = [
  'picsum.photos',
  'fastly.picsum.photos',
  'images.unsplash.com',
  'images.pexels.com',
  'cdn.pixabay.com',
  'i.imgur.com',
  'res.cloudinary.com'
];

export const findArticlesValidationSchema = z.object({
  page: z.coerce.number('Invalid page. Must be a number').int().positive().default(1),
  limit: z.coerce
    .number('Invalid limit. Must be a number')
    .int()
    .positive()
    .max(ARTICLE_MAX_PAGE_SIZE)
    .default(ARTICLE_PAGE_SIZE),
  search: z.string().min(3).optional(),
  category: z.enum(CATEGORY_SLUGS).optional(),
  order: z.enum(['asc', 'desc']).default('desc').catch('desc'),
  authorUsername: z
    .string()
    .trim()
    .min(3)
    .regex(/^[a-zA-Z0-9._]+$/)
    .optional(),
});
export const findMyArticlesValidationSchema = z.object({
  page: z.coerce.number('Invalid page. Must be a number').int().positive().default(1),
  limit: z.coerce
    .number('Invalid limit. Must be a number')
    .int()
    .positive()
    .max(ARTICLE_MAX_PAGE_SIZE)
    .default(ARTICLE_PAGE_SIZE),
  search: z.string().min(3).optional(),
  category: z.enum(CATEGORY_SLUGS).optional(),
  order: z.enum(['asc', 'desc']).default('desc').catch('desc'),
  status: z.enum(['PUBLISHED', 'DRAFT', 'SCHEDULED']).optional(),
});

export const myArticleValidationSchema = z.object({
  slug: z.string('Slug is required').min(3, 'Minimum slug length is 3 characters'),
  authorId: z.number('Debes estar autenticado para ver tus artículos'),
});

export const articleDetailValidationSchema = z.object({
  authorUsername: z
    .string('Author is required')
    .min(3, 'Minimum author length is 3 characters'),
  slug: z.string('Slug is required').min(3, 'Minimum slug length is 3 characters'),
});

export const createArticleValidationSchema = z.object({
  title: z.string().min(2, 'El título debe tener al menos 2 caracteres'),
  content: z
    .string()
    .min(5, 'El contenido debe tener al menos 5 caracteres')
    .transform(sanitizeArticleContent)
    .pipe(z.string().min(5, 'El contenido debe tener al menos 5 caracteres')),
  intro: z.string().min(5, 'La introducción es obligatoria, al menos 5 caracteres'),
  slug: z.string().optional(),
  status: z.enum(['PUBLISHED', 'DRAFT']),
  publishedAt: z.string().optional().nullable(),
  featuredImageUrl: z
    .string()
    .url('Debe ser una URL válida')
    .refine((url) => {
      try {
        const hostname = new URL(url).hostname;
        return ALLOWED_IMAGE_DOMAINS.includes(hostname);
      } catch {
        return false;
      }
    }, `Dominio no soportado. Dominios permitidos: ${ALLOWED_IMAGE_DOMAINS.join(', ')}`)
    .optional()
    .nullable(),

  featuredVideoUrl: z
    .string()
    .url('Debe ser una URL válida')
    .refine(
      (url) => url.match(/\.(mp4|webm|ogg)$/i) || url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com'),
      'Debe ser un enlace a un vídeo (YouTube, Vimeo, o archivo .mp4/.webm)'
    )
    .optional()
    .nullable(),
  categorySlugs: z
    .array(z.enum(CATEGORY_SLUGS))
    .min(1, 'Debes seleccionar al menos una categoría'),
});

export const updateArticleValidationSchema = z.object({
  title: z.string().min(2, 'El título debe tener al menos 2 caracteres').optional(),
  content: z
    .string()
    .min(5, 'El contenido debe tener al menos 5 caracteres')
    .transform(sanitizeArticleContent)
    .pipe(z.string().min(5, 'El contenido debe tener al menos 5 caracteres'))
    .optional(),
  intro: z.string().min(5, 'La introducción es obligatoria, al menos 5 caracteres').optional(),
  status: z.enum(['PUBLISHED', 'DRAFT']).optional(),
  publishedAt: z.string().optional().nullable(),
  featuredImageUrl: z
    .string()
    .url('Debe ser una URL válida')
    .refine((url) => {
      try {
        const hostname = new URL(url).hostname;
        return ALLOWED_IMAGE_DOMAINS.includes(hostname);
      } catch {
        return false;
      }
    }, `Dominio no soportado. Dominios permitidos: ${ALLOWED_IMAGE_DOMAINS.join(', ')}`)
    .optional()
    .nullable(),

  featuredVideoUrl: z
    .string()
    .url('Debe ser una URL válida')
    .refine(
      (url) => url.match(/\.(mp4|webm|ogg)$/i) || url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com'),
      'Debe ser un enlace a un vídeo (YouTube, Vimeo, o archivo .mp4/.webm)'
    )
    .optional()
    .nullable(),
  categorySlugs: z
    .array(z.enum(CATEGORY_SLUGS))
    .min(1, 'Debes seleccionar al menos una categoría')
    .optional(),
});
