'use client';

import { Tabs, type Key } from '@heroui/react';
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
    <Tabs
      isDisabled={isPending}
      selectedKey={value}
      onSelectionChange={onSelectChange}
    >
      <Tabs.ListContainer className="bg-black/5">
        <Tabs.List
          aria-label={label}
          className="space-x-1"
        >
          {items.map((item) => (
            <Tabs.Tab
              key={item.id}
              id={item.id}
              aria-label={item.label}
              className=" text-xs px-2 py-0"
            >
              {item.id.toUpperCase()}
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
      {items.map((item) => (
        <Tabs.Panel
          key={item.id}
          id={item.id}
          className="hidden"
        >
          {null}
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
