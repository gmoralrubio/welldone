'use client';

import { articlesListHref } from '@/lib/article/article-query';
import { Pagination } from '@heroui/react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import type {
  ArticleListPathname,
  ArticleListStatus,
  ArticleOrder,
  ArticleQuery,
} from '@/lib/article/article-query';

type ArticlePaginationProps = {
  page: number;
  pages: number;
  search: string;
  order: ArticleOrder;
  category: ArticleQuery['category'];
  pathname?: ArticleListPathname;
  status?: ArticleListStatus;
};

export function ArticlePagination({
  page,
  pages,
  search,
  order,
  category,
  pathname,
  status,
}: ArticlePaginationProps) {
  const router = useRouter();
  const t = useTranslations('ArticlesPage');
  const totalPages = Math.max(pages, 1);

  const goToPage = (nextPage: number) => {
    router.push(
      articlesListHref({
        page: nextPage,
        search,
        order,
        category,
        pathname,
        status,
      })
    );
  };

  return (
    <Pagination
      aria-label={t('paginationAria')}
      className="mt-10 items-center justify-between"
    >
      <Pagination.Summary className="text-sm text-muted">
        {t('pageSummary', { page, total: totalPages })}
      </Pagination.Summary>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous
            isDisabled={page <= 1}
            onPress={() => goToPage(page - 1)}
          >
            <Pagination.PreviousIcon />
            <span>{t('previous')}</span>
          </Pagination.Previous>
        </Pagination.Item>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <Pagination.Item key={pageNumber}>
            <Pagination.Link
              isActive={pageNumber === page}
              onPress={() => goToPage(pageNumber)}
            >
              {pageNumber}
            </Pagination.Link>
          </Pagination.Item>
        ))}
        <Pagination.Item>
          <Pagination.Next
            isDisabled={page >= totalPages}
            onPress={() => goToPage(page + 1)}
          >
            <span>{t('next')}</span>
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
