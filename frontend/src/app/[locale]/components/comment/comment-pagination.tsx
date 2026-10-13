'use client';

import { Pagination } from '@heroui/react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { commentsHref } from '@/lib/comment/comment-query';
import { useEffect, useRef } from 'react';

type CommentPaginationProps = {
  authorUsername: string;
  slug: string;
  page: number;
  pages: number;
};

export function CommentPagination({
  authorUsername,
  slug,
  page,
  pages,
}: CommentPaginationProps) {
  const router = useRouter();
  const t = useTranslations('ArticleDetailPage');
  const totalPages = Math.max(pages, 1);
  // Hace scroll a comentarios cuando se cambia de página, omitiendo el primer render
  const previousPage = useRef(page);

  useEffect(() => {
    if (previousPage.current === page) return;
    previousPage.current = page;
    document.getElementById('comments')?.scrollIntoView({ block: 'start' });
  }, [page]);

  return (
    <Pagination
      aria-label={t('commentsPaginationAria')}
      className="w-full justify-center"
    >
      <Pagination.Summary className="text-sm text-muted">
        {t('commentsPageSummary', { page, total: totalPages })}
      </Pagination.Summary>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous
            isDisabled={page <= 1}
            onPress={() =>
              router.push(commentsHref(authorUsername, slug, page - 1), { scroll: false })
            }
          >
            <Pagination.PreviousIcon />
            <span>{t('commentsPrevious')}</span>
          </Pagination.Previous>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Next
            isDisabled={page >= totalPages}
            onPress={() =>
              router.push(commentsHref(authorUsername, slug, page + 1), { scroll: false })
            }
          >
            <span>{t('commentsNext')}</span>
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
