'use server';

import {
  articleQueryParams,
  parseArticleQuery,
} from '@/app/[locale]/articles/article-query';
import { ArticleDto } from '@/lib/articles.types';
import { redirect } from '@/i18n/navigation';
import { PaginatedResponse } from '@/lib/pagination.types';
import { cookies } from 'next/headers';
import { resolveLocale } from '@/i18n/locale-utils';

type ArticlesSearchParams = Record<string, string | string[] | undefined>;

export async function getArticles(
  searchParams: ArticlesSearchParams
): Promise<PaginatedResponse<ArticleDto>> {
  const criteria = parseArticleQuery(searchParams);
  const params = articleQueryParams(criteria);

  const response = await fetch(
    `${process.env.API_URL}/api/articles?${params.toString()}`
  );

  if (!response.ok) throw new Error('No se pudieron cargar los artículos');

  const data: PaginatedResponse<ArticleDto> = await response.json();

  return data;
}

export async function getArticleByAuthorAndSlug(
  authorUsername: string,
  slug: string
): Promise<ArticleDto | null> {
  const response = await fetch(
    `${process.env.API_URL}/api/articles/${authorUsername}/${slug}`
  );

  if (response.status === 404) return null;
  if (!response.ok) throw new Error('No se pudo cargar el artículo');
  const data: { article: ArticleDto } = await response.json();
  return data.article;
}

export async function createArticleAction(locale: string, formData: FormData) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const payload = {
    title: formData.get('title'),
    intro: formData.get('intro'),
    content: formData.get('content'),
    status: formData.get('status'),
    categorySlugs: formData.getAll('categorySlugs'),
    featuredImageUrl: formData.get('featuredImageUrl') || null,
    featuredVideoUrl: formData.get('featuredVideoUrl') || null,
  };

  console.log(payload);

  const response = await fetch(`${process.env.API_URL}/api/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al crear el artículo');
  }

  const { article } = await response.json();

  redirect({
    href: `/articles/${article.author.username}/${article.slug}`,
    locale: resolveLocale(locale),
  });
}

export async function getMyArticlesAction(
  searchParams: ArticlesSearchParams
): Promise<PaginatedResponse<ArticleDto>> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    throw new Error('No autorizado');
  }

  const criteria = parseArticleQuery(searchParams);
  const params = articleQueryParams(criteria);

  if (searchParams.status) {
    params.append('status', searchParams.status as string);
  }

  const response = await fetch(
    `${process.env.API_URL}/api/articles/me?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) throw new Error('No se pudieron cargar tus artículos');

  return await response.json();
}