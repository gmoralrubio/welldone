'use client';

import { ArticleOrder, articlesHref } from '@/app/articles/article-query';
import { Pagination } from '@heroui/react';
import { useRouter } from 'next/navigation';

type ArticlePaginationProps = {
  page: number;
  pages: number;
  search: string;
  order: ArticleOrder;
};

export function ArticlePagination({
  page,
  pages,
  search,
  order,
}: ArticlePaginationProps) {
  const router = useRouter();
  const totalPages = Math.max(pages, 1);

  return (
    <Pagination
      aria-label="Paginación de artículos"
      className="mt-10 items-center justify-between"
    >
      <Pagination.Summary className="text-sm text-muted">
        Página {page} de {totalPages}
      </Pagination.Summary>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous
            isDisabled={page <= 1}
            onPress={() => router.push(articlesHref({ page: page - 1, search, order }))}
          >
            <Pagination.PreviousIcon />
            <span>Anterior</span>
          </Pagination.Previous>
        </Pagination.Item>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <Pagination.Item key={pageNumber}>
            <Pagination.Link
              isActive={pageNumber === page}
              onPress={() =>
                router.push(articlesHref({ page: pageNumber, search, order }))
              }
            >
              {pageNumber}
            </Pagination.Link>
          </Pagination.Item>
        ))}
        <Pagination.Item>
          <Pagination.Next
            isDisabled={page >= totalPages}
            onPress={() => router.push(articlesHref({ page: page + 1, search, order }))}
          >
            <span>Siguiente</span>
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
