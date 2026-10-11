'use client';

import { Pagination } from '@heroui/react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

type CommentPaginationProps = {
  authorUsername: string;
  slug: string;
  page: number;
  pages: number;
};

function commentsHref(authorUsername: string, slug: string, page: number) {
  const pathname = `/articles/${encodeURIComponent(authorUsername)}/${encodeURIComponent(slug)}`;
  if (page <= 1) return pathname;
  return `${pathname}?commentsPage=${page}`;
}

export function CommentPagination({
  authorUsername,
  slug,
  page,
  pages,
}: CommentPaginationProps) {
  const router = useRouter();
  const t = useTranslations('ArticleDetailPage');
  const totalPages = Math.max(pages, 1);

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
            onPress={() => router.push(commentsHref(authorUsername, slug, page - 1))}
          >
            <Pagination.PreviousIcon />
            <span>{t('commentsPrevious')}</span>
          </Pagination.Previous>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Next
            isDisabled={page >= totalPages}
            onPress={() => router.push(commentsHref(authorUsername, slug, page + 1))}
          >
            <span>{t('commentsNext')}</span>
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
