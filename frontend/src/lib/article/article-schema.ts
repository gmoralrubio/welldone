import { z } from 'zod';
import { CATEGORY_SLUGS } from '@/lib/category/category.types';

export const createArticleFrontendSchema = z.object({
  title: z.string().min(2, 'titleMinLength'),
  content: z.string().min(5, 'contentMinLength'),
  intro: z.string().min(5, 'introMinLength'),
  status: z.enum(['PUBLISHED', 'DRAFT']),
  publishedAt: z.string().optional().nullable(),
  featuredImageUrl: z.string().url('invalidUrl').optional().nullable(),
  featuredVideoUrl: z.string().url('invalidUrl').optional().nullable(),
  categorySlugs: z
    .array(z.enum(CATEGORY_SLUGS))
    .min(1, 'categoryRequired'),
});

export type ArticleFormData = z.infer<typeof createArticleFrontendSchema>;