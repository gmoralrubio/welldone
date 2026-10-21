'use client';

import { useEffect, useState } from 'react';
import { SidebarMenu } from '@/app/[locale]/components/dashboard/sidebar-menu';
import { usePathname } from '@/i18n/navigation';

type UserSidebarProps = {
  username: string;
};

export function UserSidebar({ username }: UserSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      {/* Menú de escritorio. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-[clamp(120px,12vw,176px)] min-[1360px]:block">
        <div className="pointer-events-auto sticky top-16 h-[calc(100vh-4rem)] border-r border-separator bg-background-secondary">
          <aside
            aria-label="Navegación del usuario"
            className="flex h-full w-full flex-col p-2"
          >
            <SidebarMenu username={username} />
          </aside>
        </div>
      </div>

      {/* Menú móvil. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-full min-[1360px]:hidden">
        <div className="pointer-events-none sticky top-16 h-[calc(100vh-4rem)]">
          {/* Botón debajo del header. */}
          <div className="pointer-events-auto absolute left-8 top-4 z-20">
            <button
              type="button"
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isOpen}
              aria-controls="mobile-user-navigation"
              onClick={() => setIsOpen((current) => !current)}
              className="flex size-9 items-center justify-center rounded-full border border-separator bg-background-secondary text-foreground shadow-sm transition-colors hover:bg-surface-secondary"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                className="size-4"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>

          {/* Zona transparente para cerrar al pulsar fuera. */}
          <button
            type="button"
            aria-label="Cerrar menú"
            aria-hidden={!isOpen}
            tabIndex={isOpen ? 0 : -1}
            onClick={() => setIsOpen(false)}
            className={`absolute inset-0 z-10 cursor-default bg-transparent ${
              isOpen ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
          />

          {/* Barra móvil deslizante. */}
          <aside
            id="mobile-user-navigation"
            aria-label="Navegación del usuario"
            aria-hidden={!isOpen}
            inert={!isOpen}
            className={`pointer-events-auto absolute inset-y-0 left-0 z-20 w-48 max-w-[85vw] overflow-y-auto border-r border-separator bg-background-secondary p-3 transition-transform duration-300 ease-in-out ${
              isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <SidebarMenu username={username} />
          </aside>
        </div>
      </div>
    </>
  );
}
