import z from 'zod';
export const COMMENT_PAGE_SIZE = 5;
export const COMMENT_MAX_PAGE_SIZE = 20;

export const findCommentValidationSchema = z.object({
  authorUsername: z
    .string('Author is required')
    .min(3, 'Minimum author length is 3 characters'),
  slug: z
    .string('Slug is required')
    .min(3, 'Minimum slug length is 3 characters'),
});
export const createCommentValidationSchema = z.object({
  message: z
    .string('Message is required')
    .trim()
    .min(1, 'El comentario no puede estar vacío')
    .max(2000, 'El comentario no puede superar los 2000 caracteres'),
  parentId: z.number().int().positive().optional(),
});

export const commentPaginationValidationSchema = z.object({
  page: z.coerce
    .number('Invalid page. Must be a number')
    .int()
    .positive()
    .default(1),
  limit: z.coerce
    .number('Invalid limit. Must be a number')
    .int()
    .positive()
    .max(COMMENT_MAX_PAGE_SIZE)
    .default(COMMENT_PAGE_SIZE),
});
