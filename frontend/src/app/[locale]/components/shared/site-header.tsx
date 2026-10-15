import { cookies } from 'next/headers';
import { ArticleOrder } from '@/lib/article/article-query';
import { SiteHeaderClient } from './site-header-client';

type SiteHeaderProps = {
  search: string;
  order: ArticleOrder;
};

type HeaderUser = {
  name: string;
  username: string;
};

export async function SiteHeader({ search, order }: SiteHeaderProps) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  let user: HeaderUser | null = null;

  if (accessToken) {
    try {
      const response = await fetch(`${process.env.API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      });

      if (response.ok) {
        const data: HeaderUser = await response.json();

        user = {
          name: data.name,
          username: data.username,
        };
      }
    } catch (error) {
      console.error('Error al obtener el usuario de la cabecera:', error);
    }
  }

  return (
    <SiteHeaderClient
      search={search}
      order={order}
      user={user}
    />
  );
}
