'use client';

import { Surface, SearchField } from '@heroui/react';
import { articleCategories } from '@/lib/articles.types';
import { SelectOrder } from '@/app/[locale]/components/article/select-order';
import { ArticleOrder } from '@/app/[locale]/articles/article-query';
import { Link, getPathname } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';

type SiteSidebarProps = {
  search: string;
  order: ArticleOrder;
};

const frequentSearches = ['TypeScript', 'Clean Code', 'Arquitectura', 'DevOps'];

export function SiteSidebar({ search, order }: SiteSidebarProps) {
  const locale = useLocale();
  const t = useTranslations('SiteSidebar');
  const tCategories = useTranslations('Categories');
  const articlesAction = getPathname({ locale, href: '/articles' });

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
        </form>
        <div className="mb-4">
          <p className="text-xs font-bold text-muted uppercase mb-2">{t('order')}</p>
          <SelectOrder />
        </div>
        <div>
          <p className="text-xs font-bold text-muted uppercase mb-2">
            {t('frequentSearches')}
          </p>
          <div className="flex flex-wrap gap-2">
            {frequentSearches.map((term) => (
              <Link
                key={term}
                href={{
                  pathname: '/articles',
                  query: { search: term },
                }}
                className="rounded-full bg-field px-2.5 py-1 text-xs font-medium tracking-[0.24px] text-[#45464d] no-underline"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </Surface>

      <Surface className="bg-surface-tertiary p-6 shadow-accent-dark rounded-3xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-muted uppercase mb-4">{t('categories')}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {articleCategories.map((category) => (
            <Link
              key={category.id}
              href={{
                pathname: '/articles',
                query: { search: String(category.id) },
              }}
              className="rounded bg-field px-3 py-1.5 text-sm font-semibold text-foreground no-underline"
            >
              <span className="mr-1 text-muted">#</span>
              {tCategories(String(category.id) as '1')}
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
          href="/articles/create"
          className="mt-4 flex w-full items-center justify-center rounded-sm bg-surface px-4 py-2 text-sm font-semibold text-black no-underline"
        >
          {t('membershipCta')}
        </Link>
      </Surface>
    </aside>
  );
}
