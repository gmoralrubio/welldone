'use server';

import { articleHref } from '@/lib/article/article-presenters';
import { articleQueryParams, parseArticleQuery } from '@/lib/article/article-query';
import { ArticleDto } from '@/lib/article/articles.types';
import { CommentDto } from '@/lib/comment/comments.types';
import { redirect } from '@/i18n/navigation';
import { PaginatedResponse } from '@/lib/shared/pagination.types';
import { revalidatePath } from 'next/cache';
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

export async function getArticlesByAuthor(
  authorUsername: string,
  searchParams: ArticlesSearchParams
): Promise<PaginatedResponse<ArticleDto> | null> {
  const criteria = parseArticleQuery(searchParams);
  const params = articleQueryParams(criteria);
  params.set('authorUsername', authorUsername);

  const response = await fetch(
    `${process.env.API_URL}/api/articles?${params.toString()}`
  );

  if (response.status === 404) return null;
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

  if (response.status === 404 || response.status === 409) return null;
  if (!response.ok) throw new Error('No se pudo cargar el artículo');
  const data: { article: ArticleDto } = await response.json();
  return data.article;
}

function isCommentPage(value: unknown): value is PaginatedResponse<CommentDto> {
  if (!value || typeof value !== 'object') return false;

  const page = value as PaginatedResponse<CommentDto>;

  return Array.isArray(page.data) && !!page.meta && typeof page.meta === 'object';
}

export async function getArticleComments(
  authorUsername: string,
  slug: string,
  page: number
): Promise<PaginatedResponse<CommentDto> | null> {
  const params = new URLSearchParams({ page: String(page) });

  try {
    const response = await fetch(
      `${process.env.API_URL}/api/articles/${authorUsername}/${slug}/comments?${params.toString()}`
    );

    if (!response.ok) return null;

    const data: unknown = await response.json();

    return isCommentPage(data) ? data : null;
  } catch {
    return null;
  }
}

type CommentFormUser = {
  name: string;
  surname: string;
  username: string;
};

export async function getCommentAuthor(
  accessToken: string
): Promise<CommentFormUser | null> {
  const response = await fetch(`${process.env.API_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) return null;

  const user: CommentFormUser = await response.json();
  return user;
}

export async function createCommentAction(
  locale: string,
  authorUsername: string,
  slug: string,
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return { error: 'unauthorized' };
  }

  const message = formData.get('message');
  const parentIdValue = formData.get('parentId');
  const payload: { message: FormDataEntryValue | null; parentId?: number } = {
    message,
  };

  if (typeof parentIdValue === 'string' && parentIdValue.length > 0) {
    const parentId = Number(parentIdValue);
    if (Number.isInteger(parentId) && parentId > 0) {
      payload.parentId = parentId;
    }
  }

  let response: Response;
  try {
    response = await fetch(
      `${process.env.API_URL}/api/articles/${authorUsername}/${slug}/comments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      }
    );
  } catch {
    return { error: 'generic' };
  }

  if (!response.ok) {
    return { error: 'generic' };
  }

  revalidatePath(`/${resolveLocale(locale)}/articles/${authorUsername}/${slug}`);
  redirect({
    href: `/articles/${authorUsername}/${slug}`,
    locale: resolveLocale(locale),
  });
  return { error: null };
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
    href: articleHref(article),
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

export async function getMyArticleBySlug(slug: string): Promise<ArticleDto | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    throw new Error('No autorizado');
  }

  const response = await fetch(`${process.env.API_URL}/api/articles/me/${slug}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error('No se pudo cargar el artículo');

  const data: { article: ArticleDto } = await response.json();
  return data.article;
}

export async function getArticleById(id: string): Promise<ArticleDto> {
  const response = await fetch(`${process.env.API_URL}/api/articles/${id}`, {
    cache: 'no-store',
  });

  if (!response.ok) throw new Error('No se pudo cargar el artículo para editar');
  
  const data = await response.json();

  return data.article || data; 
}

export async function updateArticleAction(locale: string, articleId: string, formData: FormData) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    throw new Error('No autorizado');
  }

  const payload = {
    title: formData.get('title'),
    intro: formData.get('intro'),
    content: formData.get('content'),
    status: formData.get('status'),
    categorySlugs: formData.getAll('categorySlugs'),
    featuredImageUrl: formData.get('featuredImageUrl') || null,
    featuredVideoUrl: formData.get('featuredVideoUrl') || null,
  };

  const response = await fetch(`${process.env.API_URL}/api/articles/${articleId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al actualizar el artículo');
  }

  redirect({
    href: '/dashboard/my-articles',
    locale: resolveLocale(locale),
  });
}