'use server';

import { articleQueryParams, parseArticleQuery } from '@/app/articles/article-query';
import { ArticleDto } from '@/lib/articles.types';
import { redirect } from 'next/navigation';
import { PaginatedResponse } from '@/lib/pagination.types';

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

export async function createArticleAction(formData: FormData) {
  // Seed password, solo para pruebas:
  //Login usuario del seed
  const loginResponse = await fetch(`${process.env.API_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'jdoe', password: 'Seed1234!' }),
  });

  if (!loginResponse.ok) {
    //throw new Error('Error de autenticación.');
    const errorDetails = await loginResponse.text();
    throw new Error(`Fallo en el backend: ${loginResponse.status} - ${errorDetails}`);
  }

  const { accessToken } = await loginResponse.json();

  const payload = {
    title: formData.get('title'),
    intro: formData.get('intro'),
    content: formData.get('content'),
    status: formData.get('status'),
    categoryIds: [Number(formData.get('categoryId'))],
    featuredImageUrl: formData.get('featuredImageUrl') || null,
    featuredVideoUrl: formData.get('featuredVideoUrl') || null,
  };

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

  // Al terminar la creación redirigir al detalle del artículo
  redirect(`/articles/${article.author.username}/${article.slug}`);
}
