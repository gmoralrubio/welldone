'use client';

import { ArticleOrder, articlesHref } from '@/app/[locale]/articles/article-query';
import { ListBox, Select, type Key } from '@heroui/react';
import { useRouter, useSearchParams } from 'next/navigation';

export function SelectOrder() {
  const orders = [
    {
      id: 'desc',
      name: 'Más recientes',
    },
    {
      id: 'asc',
      name: 'Más antiguos',
    },
  ];

  const router = useRouter();
  const searchParams = useSearchParams();
  const order = searchParams.get('order') as ArticleOrder;
  const search = searchParams.get('search');

  const handleOnChange = (value: Key | null) => {
    const order = value === 'asc' ? 'asc' : 'desc';
    router.push(articlesHref({ page: 1, search: search ?? '', order }));
  };

  return (
    <div className="space-y-2">
      <Select
        className="w-full"
        placeholder="Selecciona el orden"
        aria-label="Orden"
        value={order}
        onChange={(value) => handleOnChange(value)}
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {orders.map((order) => (
              <ListBox.Item
                key={order.id}
                id={order.id}
                textValue={order.name}
              >
                {order.name}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}
