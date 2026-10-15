'use client';

import { useState, useRef, useEffect } from 'react';
import { Link } from '@/i18n/navigation';

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
                setIsOpen(false);

              }}
              className="block w-full rounded-md px-3 py-2 text-left text-sm text-danger hover:bg-danger-50"
              style={{ cursor: 'pointer' }}
            >
              {deleteLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}