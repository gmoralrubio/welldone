'use client';

import { useRef, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { deleteAccount } from './actions';

export default function DeleteAccount() {
  const t = useTranslations('Account.delete');
  const router = useRouter();

  const dialogRef = useRef<HTMLDialogElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function openDialog() {
    setError(null);
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    if (!isPending) {
      dialogRef.current?.close();
    }
  }

  function handleDelete() {
    if (isPending) {
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        const result = await deleteAccount();

        if (result.status === 204) {
          dialogRef.current?.close();
          router.replace('/articles');
          router.refresh();
          return;
        }

        setError(t('error'));
      } catch {
        setError(t('error'));
      }
    });
  }

  return (
    <section className="w-full max-w-xl rounded-xl bg-white p-6 shadow-md sm:p-8">
      <h2 className="font-serif text-2xl font-semibold text-black">{t('title')}</h2>

      <p className="mt-3 text-sm leading-6 text-[#45464d]">{t('description')}</p>

      <button
        type="button"
        onClick={openDialog}
        className="mt-6 rounded-lg bg-red-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-800"
      >
        {t('button')}
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        onCancel={(event) => {
          if (isPending) {
            event.preventDefault();
          }
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl bg-white p-6 shadow-xl backdrop:bg-black/50"
      >
        <h3
          id="delete-dialog-title"
          className="font-serif text-2xl font-semibold text-black"
        >
          {t('modalTitle')}
        </h3>

        <p
          id="delete-dialog-description"
          className="mt-4 text-sm leading-6 text-[#45464d]"
        >
          {t('modalDescription')}
        </p>

        {error && (
          <p
            role="alert"
            className="mt-4 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={closeDialog}
            disabled={isPending}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('cancel')}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? t('confirming') : t('confirm')}
          </button>
        </div>
      </dialog>
    </section>
  );
}
