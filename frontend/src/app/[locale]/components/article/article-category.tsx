'use client';

import { CategorySlug } from '@/app/[locale]/category/category.types';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

type ArticleCategoryProps = {
  categorySlug: CategorySlug;
};

export function ArticleCategory({ categorySlug }: ArticleCategoryProps) {
  const t = useTranslations('Categories');

  return (
    <Link
      href={{
        pathname: '/articles',
        query: { category: categorySlug },
      }}
      className="rounded-sm bg-accent/50 px-2 py-0.5 text-xs font-bold text-accent-foreground uppercase"
    >
      {t(categorySlug)}
    </Link>
  );
}
