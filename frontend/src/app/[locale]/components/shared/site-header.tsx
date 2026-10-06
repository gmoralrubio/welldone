import { cookies } from 'next/headers';
import { ArticleOrder } from '@/app/[locale]/articles/article-query';
import { SiteHeaderClient } from './site-header-client';

type SiteHeaderProps = {
  search: string;
  order: ArticleOrder;
};

export async function SiteHeader({ search, order }: SiteHeaderProps) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.has('accessToken');

  return (
    <SiteHeaderClient
      search={search}
      order={order}
      isAuthenticated={isAuthenticated}
    />
  );
}
