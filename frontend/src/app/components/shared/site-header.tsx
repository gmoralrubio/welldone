'use client';

import { Link, SearchField } from '@heroui/react';
import { ArticleOrder } from '@/app/articles/article-query';
import UserActions from './user-actions';

type SiteHeaderProps = {
  search: string;
  order: ArticleOrder;
};

export function SiteHeader({ search, order }: SiteHeaderProps) {
  return (
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
              action="/articles"
              className="hidden w-80 md:block"
            >
              <SearchField
                aria-label="Buscar artículos"
                className="w-full"
                defaultValue={search}
                name="search"
              >
                <SearchField.Group className="h-7 rounded bg-field">
                  <SearchField.SearchIcon />
                  <SearchField.Input
                    placeholder="Buscar artículos..."
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
          <UserActions />
        </div>
      </div>
    </header>
  );
}
