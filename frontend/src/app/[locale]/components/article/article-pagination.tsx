'use client';

import { articlesListHref } from '@/app/[locale]/articles/article-query';
import { Pagination } from '@heroui/react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import type { ArticleOrder } from '@/app/[locale]/articles/article-query';
import { CategorySlug } from '@/app/[locale]/category/category.types';

type ArticlePaginationProps = {
  page: number;
  pages: number;
  search: string;
  order: ArticleOrder;
  category: CategorySlug;
};

export function ArticlePagination({
  page,
  pages,
  search,
  order,
  category,
}: ArticlePaginationProps) {
  const router = useRouter();
  const t = useTranslations('ArticlesPage');
  const totalPages = Math.max(pages, 1);

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
            onPress={() =>
              router.push(articlesListHref({ page: page - 1, search, order, category }))
            }
          >
            <Pagination.PreviousIcon />
            <span>{t('previous')}</span>
          </Pagination.Previous>
        </Pagination.Item>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <Pagination.Item key={pageNumber}>
            <Pagination.Link
              isActive={pageNumber === page}
              onPress={() =>
                router.push(
                  articlesListHref({ page: pageNumber, search, order, category })
                )
              }
            >
              {pageNumber}
            </Pagination.Link>
          </Pagination.Item>
        ))}
        <Pagination.Item>
          <Pagination.Next
            isDisabled={page >= totalPages}
            onPress={() =>
              router.push(articlesListHref({ page: page + 1, search, order, category }))
            }
          >
            <span>{t('next')}</span>
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
