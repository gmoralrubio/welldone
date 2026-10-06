import { ArticleOrder } from '@/app/articles/article-query';
import { SiteHeaderClient } from './site-header-client';

type SiteHeaderProps = {
  search: string;
  order: ArticleOrder;
};

export function SiteHeader({ search, order }: SiteHeaderProps) {
  return (
    <SiteHeaderClient
      search={search}
      order={order}
    />
  );
}
