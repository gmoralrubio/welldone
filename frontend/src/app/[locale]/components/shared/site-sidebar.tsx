'use client';

import { Surface, SearchField } from '@heroui/react';
import { SelectOrder } from '@/app/[locale]/components/article/select-order';
import {
  ArticleListPathname,
  ArticleOrder,
  ArticleQuery,
} from '@/lib/article/article-query';
import { Link, getPathname } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { CATEGORY_SLUGS } from '@/lib/category/category.types';

type SiteSidebarProps = {
  search: string;
  order: ArticleOrder;
  category?: ArticleQuery['category'];
  listPath?: ArticleListPathname;
};

export function SiteSidebar({
  search,
  order,
  category = '',
  listPath = '/articles',
}: SiteSidebarProps) {
  const locale = useLocale();
  const t = useTranslations('SiteSidebar');
  const tCategories = useTranslations('Categories');
  const articlesAction = getPathname({ locale, href: listPath });

  function clearCategoryFilter() {
    const url = new URL(window.location.href);
    url.searchParams.delete('category');
    url.searchParams.delete('page');
    window.location.assign(url.toString());
  }

  return (
    <aside className="flex flex-col gap-6">
      <Surface className="bg-surface-tertiary p-6 shadow-accent-dark rounded-3xl">
        <div>
          <p className="text-xs font-bold text-muted uppercase mb-2">{t('search')}</p>
        </div>
        <form
          action={articlesAction}
          className="mb-4"
        >
          <SearchField
            aria-label={t('searchAria')}
            className="w-full"
            defaultValue={search}
            name="search"
          >
            <SearchField.Group className="rounded bg-field">
              <SearchField.SearchIcon />
              <SearchField.Input
                name="search"
                placeholder={t('searchPlaceholder')}
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
          {category ? (
            <input
              type="hidden"
              name="category"
              value={category}
            />
          ) : null}
        </form>
        <div>
          <p className="text-xs font-bold text-muted uppercase mb-2">{t('order')}</p>
          <SelectOrder listPath={listPath} />
        </div>
      </Surface>

      <Surface className="bg-surface-tertiary p-6 shadow-accent-dark rounded-3xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xs font-bold text-muted uppercase">{t('categories')}</h2>
          {category ? (
            <button
              type="button"
              onClick={clearCategoryFilter}
              className="text-xs font-semibold text-muted underline-offset-2 hover:underline"
            >
              {t('clearFilter')}
            </button>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_SLUGS.map((slug) => (
            <Link
              key={slug}
              href={{
                pathname: listPath,
                query: {
                  category: slug,
                  ...(search ? { search } : {}),
                  ...(order === 'asc' ? { order } : {}),
                },
              }}
              className="rounded bg-field px-3 py-1.5 text-sm font-semibold text-foreground no-underline"
            >
              <span className="mr-1 text-muted">#</span>
              {tCategories(slug)}
            </Link>
          ))}
        </div>
      </Surface>

      <Surface className="bg-accent-dark p-6 text-white shadow-md rounded-3xl">
        <p className="flex items-center gap-1 text-xs font-bold tracking-widest text-accent uppercase">
          <span className="size-1.5 rounded-full bg-[#9cf2e8]" />
          {t('membershipBadge')}
        </p>
        <h2 className="mt-2 font-serif text-xl font-medium">{t('membershipTitle')}</h2>
        <p className="mt-2 text-xs leading-4  text-accent-dark-foreground/70">
          {t('membershipBody')}
        </p>
        <Link
          href="/dashboard/create"
          className="mt-4 flex w-full items-center justify-center rounded-sm bg-surface px-4 py-2 text-sm font-semibold text-black no-underline"
        >
          {t('membershipCta')}
        </Link>
      </Surface>
    </aside>
  );
}
