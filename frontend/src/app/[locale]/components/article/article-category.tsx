'use client';

import { Chip } from '@heroui/react';
import { useTranslations } from 'next-intl';

type CategoryId = '1' | '2' | '3' | '4' | '5' | '6';

type ArticleCategoryProps = {
  categoryId: number;
};

export function ArticleCategory({ categoryId }: ArticleCategoryProps) {
  const t = useTranslations('Categories');
  const key = String(categoryId) as CategoryId;

  return (
    <Chip className="rounded-sm bg-accent/50 px-2 py-0.5 text-xs font-bold text-accent-foreground uppercase">
      {t(key)}
    </Chip>
  );
}
