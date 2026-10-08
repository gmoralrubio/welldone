'use client';

import { ArticleOrder, articlesListHref } from '@/app/[locale]/articles/article-query';
import { ListBox, Select, type Key } from '@heroui/react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { CategorySlug } from '@/app/[locale]/category/category.types';

export function SelectOrder() {
  const t = useTranslations('SelectOrder');

  const orders = [
    {
      id: 'desc' as const,
      name: t('desc'),
    },
    {
      id: 'asc' as const,
      name: t('asc'),
    },
  ];

  const router = useRouter();
  const searchParams = useSearchParams();
  const order = searchParams.get('order') as ArticleOrder;
  const search = searchParams.get('search');
  const category = searchParams.get('category') as CategorySlug;

  const handleOnChange = (value: Key | null) => {
    const nextOrder = value === 'asc' ? 'asc' : 'desc';
    router.push(
      articlesListHref({
        page: 1,
        search: search ?? '',
        order: nextOrder,
        category: category ?? '',
      })
    );
  };

  return (
    <div className="space-y-2">
      <Select
        className="w-full"
        placeholder={t('placeholder')}
        aria-label={t('ariaLabel')}
        value={order}
        onChange={(value) => handleOnChange(value)}
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {orders.map((orderOption) => (
              <ListBox.Item
                key={orderOption.id}
                id={orderOption.id}
                textValue={orderOption.name}
              >
                {orderOption.name}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}
