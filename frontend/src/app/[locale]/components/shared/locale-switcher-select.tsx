'use client';

import { ListBox, Select, type Key } from '@heroui/react';
import { useParams } from 'next/navigation';
import { Locale } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';

type LocaleItem = {
  id: Locale;
  label: string;
};

type Props = {
  items: LocaleItem[];
  value: Locale;
  label: string;
};

export default function LocaleSwitcherSelect({ items, value, label }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  function onSelectChange(nextKey: Key | null) {
    if (nextKey == null) {
      return;
    }

    const nextLocale = String(nextKey) as Locale;
    if (nextLocale === value) {
      return;
    }

    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale }
      );
    });
  }

  return (
    <Select
      aria-label={label}
      className="min-w-28"
      isDisabled={isPending}
      value={value}
      onChange={onSelectChange}
    >
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {items.map((item) => (
            <ListBox.Item
              key={item.id}
              id={item.id}
              textValue={item.label}
            >
              {item.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
