'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Link, useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { deleteArticleAction } from '@/app/[locale]/(site)/articles/actions';

const DotsIcon = () => (
  <svg fill="none" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg" className="text-default-500">
    <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
    <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
    <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
  </svg>
);

interface Props {
  articleId: string | number;
  editLabel: string;
  deleteLabel: string;
}

export function ArticleActionsMenu({ articleId, editLabel, deleteLabel }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const router = useRouter();
  const t = useTranslations('ArticleCard');
  
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  function openDialog() {
    setIsOpen(false);
    setError(null);
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    if (!isPending) {
      dialogRef.current?.close();
    }
  }

  function handleDelete() {
    if (isPending) return;
    setError(null);

    startTransition(async () => {
      try {
        const result = await deleteArticleAction(articleId);

        if (result.status === 204) {
          dialogRef.current?.close();
          router.refresh();
          return;
        }

        setError(t('deleteError') || 'No se pudo eliminar el artículo.');
      } catch {
        setError(t('deleteError') || 'Error de conexión.');
      }
    });
  }

  return (
    <div className="relative inline-block text-left" ref={menuRef}>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex h-8 w-8 items-center justify-center rounded-full text-default-500 transition-colors hover:bg-default-100"
        aria-label="Opciones del artículo"
        style={{ cursor: 'pointer' }}
      >
        <DotsIcon />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-40 origin-top-right rounded-md bg-white p-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="flex flex-col gap-1">
            <Link
              href={`/dashboard/edit/${articleId}`}
              className="block w-full rounded-md px-3 py-2 text-left text-sm text-foreground hover:bg-default-100"
              onClick={() => setIsOpen(false)}
            >
              {editLabel}
            </Link>
            
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openDialog();

              }}
              className="block w-full rounded-md px-3 py-2 text-left text-sm text-danger hover:bg-danger-50"
              style={{ cursor: 'pointer' }}
            >
              {deleteLabel}
            </button>
          </div>
        </div>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby={`delete-dialog-title-${articleId}`}
        onCancel={(event) => {
          if (isPending) event.preventDefault();
        }}
      
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl bg-white p-6 shadow-xl backdrop:bg-black/50 backdrop:backdrop-blur-sm z-50 fixed inset-0"
      >
        <h3
          id={`delete-dialog-title-${articleId}`}
          className="font-serif text-2xl font-semibold text-black"
        >
          {t('deleteModalTitle') || '¿Eliminar artículo?'}
        </h3>

        <p className="mt-4 text-sm leading-6 text-[#45464d]">
          {t('deleteModalDescription') || 'Esta acción no se puede deshacer. El artículo y todos sus comentarios serán eliminados permanentemente.'}
        </p>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-700">
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
            {t('cancel') || 'Cancelar'}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (t('confirmingDelete') || 'Eliminando...') : (t('confirmDelete') || 'Sí, eliminar')}
          </button>
        </div>
      </dialog>
    </div>
  );
}