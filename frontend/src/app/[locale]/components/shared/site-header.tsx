<<<<<<< HEAD:frontend/src/app/components/shared/site-header.tsx
import { cookies } from 'next/headers';
import { ArticleOrder } from '@/app/articles/article-query';
import { SiteHeaderClient } from './site-header-client';
=======
'use client';

import { Avatar, Dropdown, SearchField } from '@heroui/react';
import { ChevronDown, Pencil } from '@gravity-ui/icons';
import { ArticleOrder } from '@/app/[locale]/articles/article-query';
import LocaleSwitcher from '@/app/[locale]/components/shared/locale-switcher';
<<<<<<< HEAD
>>>>>>> 02aba98 (feat: añadido segmento dinámico [locale]):frontend/src/app/[locale]/components/shared/site-header.tsx
=======
import { Link, getPathname } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
>>>>>>> 0cd3e5a (wip: multiidioma)

type SiteHeaderProps = {
  search: string;
  order: ArticleOrder;
};

<<<<<<< HEAD
export async function SiteHeader({ search, order }: SiteHeaderProps) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.has('accessToken');
=======
export function SiteHeader({ search, order }: SiteHeaderProps) {
  const locale = useLocale();
  const t = useTranslations('SiteHeader');
  const articlesAction = getPathname({ locale, href: '/articles' });
>>>>>>> 0cd3e5a (wip: multiidioma)

  return (
<<<<<<< HEAD:frontend/src/app/components/shared/site-header.tsx
    <SiteHeaderClient
      search={search}
      order={order}
      isAuthenticated={isAuthenticated}
    />
=======
    <header className="sticky top-0 z-20 border-b border-separator bg-background-secondary shadow-accent-dark backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-340 flex-col px-8">
        <div className="flex h-16 items-center justify-between gap-6">
          <div className="flex min-w-0 items-center gap-6">
            <Link
              href="/articles"
              className="flex items-center gap-2 text-foreground no-underline"
            >
              <span className="grid size-8 place-items-center leading-0 rounded-md bg-accent-dark font-serif text-lg text-accent-dark-foreground pt-1">
                W
              </span>
              <span className="font-serif text-2xl font-semibold pt-1">WellDone</span>
            </Link>
            <form
              action={articlesAction}
              className="hidden w-80 md:block"
            >
              <SearchField
                aria-label={t('searchAria')}
                className="w-full"
                defaultValue={search}
                name="search"
              >
                <SearchField.Group className="h-7 rounded bg-field">
                  <SearchField.SearchIcon />
                  <SearchField.Input
                    placeholder={t('searchPlaceholder')}
                    className="text-xs"
                  />
                </SearchField.Group>
              </SearchField>
              {order === 'asc' ? (
                <input
                  type="hidden"
                  name="order"
                  value="asc"
                />
              ) : null}
            </form>
          </div>
          <div>
            <LocaleSwitcher />
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/articles/create"
              className="inline-flex items-center gap-1.5 rounded bg-accent-soft px-3 py-1.5 text-sm font-semibold text-accent-soft-foreground no-underline"
            >
              <Pencil
                width={15}
                height={15}
              />
              {t('write')}
            </Link>
            <Dropdown>
              <Dropdown.Trigger
                className="flex items-center gap-1.5 bg-transparent px-1"
                aria-label={t('accountAria')}
              >
                <Avatar
                  size="sm"
                  className="size-8"
                >
                  <Avatar.Fallback className="text-xs bg-accent-soft text-accent-soft-foreground">
                    WD
                  </Avatar.Fallback>
                </Avatar>
                <ChevronDown
                  width={8}
                  height={8}
                />
              </Dropdown.Trigger>
              <Dropdown.Popover>
                <Dropdown.Menu aria-label={t('accountAria')}>
                  <Dropdown.Item id="profile">{t('profile')}</Dropdown.Item>
                  <Dropdown.Item id="saved">{t('saved')}</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
>>>>>>> 02aba98 (feat: añadido segmento dinámico [locale]):frontend/src/app/[locale]/components/shared/site-header.tsx
  );
}
