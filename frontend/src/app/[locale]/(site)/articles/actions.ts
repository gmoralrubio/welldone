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

export async function saveFavoriteAction(
  locale: string,
  authorUsername: string,
  slug: string
): Promise<{ error: string | null; saved: boolean }> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return redirect({ href: '/login', locale: resolveLocale(locale) });
  }

  let response: Response;
  try {
    response = await fetch(
      `${process.env.API_URL}/api/articles/${authorUsername}/${slug}/favorites`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      }
    );
  } catch {
    return { error: 'generic', saved: false };
  }

  if (response.status === 401) {
    return redirect({ href: '/login', locale: resolveLocale(locale) });
  }

  if (!response.ok) {
    return { error: 'generic', saved: false };
  }

  revalidatePath(`/${resolveLocale(locale)}/dashboard/favorites`);
  return { error: null, saved: true };
}

export async function removeFavoriteAction(
  locale: string,
  authorUsername: string,
  slug: string
): Promise<{ error: string | null; saved: boolean }> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return redirect({ href: '/login', locale: resolveLocale(locale) });
  }

  let response: Response;
  try {
    response = await fetch(
      `${process.env.API_URL}/api/articles/${authorUsername}/${slug}/favorites`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      }
    );
  } catch {
    return { error: 'generic', saved: true };
  }

  if (response.status === 401) {
    return redirect({ href: '/login', locale: resolveLocale(locale) });
  }

  if (!response.ok) {
    return { error: 'generic', saved: true };
  }

  revalidatePath(`/${resolveLocale(locale)}/dashboard/favorites`);
  return { error: null, saved: false };
}

export async function submitFavoriteAction(
  locale: string,
  authorUsername: string,
  slug: string,
  prevState: { error: string | null; saved: boolean | null },
  formData: FormData
): Promise<{ error: string | null; saved: boolean | null }> {
  if (formData.get('toggleFavorite') === 'remove') {
    const result = await removeFavoriteAction(locale, authorUsername, slug);
    return result.error
      ? { error: result.error, saved: prevState.saved ?? true }
      : { error: null, saved: false };
  }

  const result = await saveFavoriteAction(locale, authorUsername, slug);
  return result.error
    ? { error: result.error, saved: prevState.saved ?? false }
    : { error: null, saved: true };
}

export async function createArticleAction(
  locale: string,
  formData: FormData
): Promise<{ error?: string; errors?: Record<string, string[]> } | void> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    throw new Error('No autorizado');
  }

  const publishedAtRaw = formData.get('publishedAt');
  let publishedAtIso = null;
  if (typeof publishedAtRaw === 'string' && publishedAtRaw.trim() !== '') {
    publishedAtIso = new Date(publishedAtRaw).toISOString();
  }

  const payload = {
    title: formData.get('title'),
    intro: formData.get('intro'),
    content: formData.get('content'),
    status: formData.get('status'),
    categorySlugs: formData.getAll('categorySlugs'),
    featuredImageUrl: formData.get('featuredImageUrl') || null,
    featuredVideoUrl: formData.get('featuredVideoUrl') || null,
    publishedAt: publishedAtIso
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
    const errorData = await response.json().catch(() => null);

    if (errorData?.errors) {
      return { errors: errorData.errors };
    }

    if (errorData?.error === 'TITLE_ALREADY_EXISTS') {
      return { error: 'TITLE_ALREADY_EXISTS' };
    }

    return { error: errorData?.error || 'Error al crear el artículo' };
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

export async function getFavoriteArticleIds(articleIds: number[]): Promise<number[]> {
  if (articleIds.length === 0) return [];

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return [];

  const params = new URLSearchParams({ articleIds: articleIds.join(',') });
  const response = await fetch(
    `${process.env.API_URL}/api/articles/me/favorites?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) return [];

  const data: { articleIds?: number[] } = await response.json();
  return data.articleIds ?? [];
}

export async function getMyFavoritesAction(
  searchParams: ArticlesSearchParams
): Promise<PaginatedResponse<ArticleDto>> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    throw new Error('No autorizado');
  }

  const criteria = parseArticleQuery(searchParams);
  const params = new URLSearchParams({ page: String(criteria.page) });
  if (criteria.limit) params.set('limit', String(criteria.limit));

  const response = await fetch(
    `${process.env.API_URL}/api/articles/me/favorites?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) throw new Error('No se pudieron cargar tus favoritos');

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

export async function updateArticleAction(
  locale: string,
  authorUsername: string,
  slug: string,
  formData: FormData
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    throw new Error('No autorizado');
  }

  const publishedAtRaw = formData.get('publishedAt');
  let publishedAtIso = null;
  if (typeof publishedAtRaw === 'string' && publishedAtRaw.trim() !== '') {
    publishedAtIso = new Date(publishedAtRaw).toISOString();
  }

  const payload = {
    title: formData.get('title'),
    intro: formData.get('intro'),
    content: formData.get('content'),
    status: formData.get('status'),
    categorySlugs: formData.getAll('categorySlugs'),
    featuredImageUrl: formData.get('featuredImageUrl') || null,
    featuredVideoUrl: formData.get('featuredVideoUrl') || null,
    publishedAt: publishedAtIso,
  };

  const response = await fetch(
    `${process.env.API_URL}/api/articles/${encodeURIComponent(authorUsername)}/${encodeURIComponent(slug)}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    if (errorData?.errors) {
      return { errors: errorData.errors };
    }

    if (errorData?.error === 'TITLE_ALREADY_EXISTS') {
      return { error: 'TITLE_ALREADY_EXISTS' };
    }

    return { error: errorData?.error || 'Error al actualizar el artículo' };
  }

  revalidatePath(`/dashboard/@${authorUsername}`);
  revalidatePath('/articles');

  redirect({
    href: `/dashboard/@${authorUsername}`,
    locale: resolveLocale(locale),
  });
}

export async function deleteArticleAction(authorUsername: string, slug: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return { status: 401, error: 'No autorizado' };
  }

  try {
    const response = await fetch(
      `${process.env.API_URL}/api/articles/${encodeURIComponent(authorUsername)}/${encodeURIComponent(slug)}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      return { status: response.status, error: 'Error al eliminar el artículo' };
    }

    // Refrescamos las cachés para que desaparezca de las listas
    revalidatePath(`/dashboard/@${authorUsername}`);
    revalidatePath('/articles');

    return { status: 204 };
  } catch {
    return { status: 500, error: 'Error de conexión' };
  }
}
