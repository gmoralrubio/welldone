'use client';

import { useRef } from 'react';
import { ArticleOrder } from '@/lib/article/article-query';
import { SearchField, Button } from '@heroui/react';
import UserActions from './user-actions';
import LocaleSwitcher from '@/app/[locale]/components/shared/locale-switcher';
import { useLocale, useTranslations } from 'next-intl';
import { Link, getPathname, usePathname, useRouter } from '@/i18n/navigation';

type SiteHeaderClientProps = {
  search: string;
  order: ArticleOrder;
  user: {
    name: string;
    surname: string;
    username: string;
  } | null;
};

export function SiteHeaderClient({ search, order, user }: SiteHeaderClientProps) {
  const locale = useLocale();

  const t = useTranslations('SiteHeader');
  const tModal = useTranslations('ConfirmExitModal');

  const pathname = usePathname();
  const router = useRouter();
  const articlesAction = getPathname({ locale, href: '/articles' });

  const isEditorMode = pathname.includes('/create') || pathname.includes('/edit');

  const cancelDialogRef = useRef<HTMLDialogElement>(null);

  const handleConfirmExit = () => {
    cancelDialogRef.current?.close();
    router.push(`/dashboard/@${user?.username}`);
  };

  return (
    <header className="sticky top-0 z-20 border-b border-separator bg-background-secondary shadow-accent-dark backdrop-blur-md">
      <div className="flex w-full flex-col px-4 sm:px-8">
        <div className="flex h-16 items-center justify-between gap-6">
          <div className="flex min-w-0 items-center gap-6">
            <Link
              href="/articles"
              className="flex items-center gap-2 text-foreground no-underline"
            >
              <span className="grid size-8 place-items-center rounded-md bg-accent-dark pt-1 font-serif text-lg leading-0 text-accent-dark-foreground">
                W
              </span>

              <span className="pt-1 font-serif text-2xl font-semibold">WellDone</span>
            </Link>

            {!isEditorMode && (
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
            )}
          </div>

          <div className="flex items-center gap-4">
            {!isEditorMode && (
              <div>
                <LocaleSwitcher />
              </div>
            )}

            {isEditorMode ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => cancelDialogRef.current?.showModal()}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-secondary"
                >
                  {t('cancelButton')}
                </button>

                <Button
                  type="submit"
                  form="article-editor-form"
                  className="rounded-sm bg-[#0f9d58] font-medium text-white"
                >
                  {t('saveButton')}
                </Button>
              </div>
            ) : (
              <UserActions user={user} />
            )}
          </div>
        </div>
      </div>

      {isEditorMode && (
        <dialog
          ref={cancelDialogRef}
          className="m-auto w-full max-w-md rounded-2xl border border-border bg-background p-0 shadow-lg backdrop:bg-black/50 backdrop:backdrop-blur-sm open:animate-in open:fade-in open:zoom-in-95"
        >
          <div className="flex flex-col gap-3 p-6">
            <h2 className="text-xl font-bold text-foreground">{tModal('title')}</h2>

            <p className="mb-4 text-sm text-foreground/80">{tModal('description')}</p>

            <div className="flex flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => cancelDialogRef.current?.close()}
                className="rounded-lg border border-border bg-transparent px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-secondary"
              >
                {tModal('cancel')}
              </button>

              <button
                type="button"
                onClick={handleConfirmExit}
                className="rounded-lg bg-[#b90000] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-800"
              >
                {tModal('confirm')}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </header>
  );
}
