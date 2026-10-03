'use client';

import { Chip, Link, ToggleButton, ToggleButtonGroup } from '@heroui/react';

const publicationLinks = ['Repositorio GitHub', 'Documentación API REST'];

const legalLinks = ['Privacidad', 'Términos'];

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-surface-tertiary">
      <div className="mx-auto grid w-full max-w-340 gap-16 px-8 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-semibold text-foreground">
                WellDone
              </span>
              <Chip className="rounded-sm bg-accent px-2 text-[10px] tracking-wide text-accent-foreground uppercase">
                KeepCoding Certified
              </Chip>
            </div>
            <p className="mt-2 max-w-md font-serif text-lg text-muted">
              Santuario editorial independiente para ensayos de cultura digital, filosofía
              contemporánea y pensamiento crítico.
            </p>
          </div>
          <div>
            <h2 className="text-[11px] font-bold tracking-[0.55px] text-[#76777d] uppercase">
              Publicación
            </h2>
            <ul className="mt-2 space-y-1">
              {publicationLinks.map((label) => (
                <li key={label}>
                  <Link
                    href="/articles"
                    className="text-sm font-semibold text-[#45464d] no-underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-[11px] font-bold tracking-[0.55px] text-[#76777d] uppercase">
              Plataforma
            </h2>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-[0.66px] text-[#76777d] uppercase">
                Idioma:
              </span>
              <ToggleButtonGroup
                aria-label="Idioma"
                size="sm"
                selectionMode="single"
                disallowEmptySelection
                defaultSelectedKeys={['es']}
                className="rounded bg-[#efeeeb] p-0.5"
              >
                <ToggleButton
                  id="es"
                  className="min-w-8 rounded-sm text-xs"
                >
                  ES
                </ToggleButton>
                <ToggleButton
                  id="en"
                  className="min-w-8 rounded-sm text-xs"
                >
                  EN
                </ToggleButton>
                <ToggleButton
                  id="fr"
                  className="min-w-8 rounded-sm text-xs"
                >
                  FR
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 border-t border-[#e3e2e0] pt-6 text-xs tracking-[0.24px] text-[#76777d] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 WellDone. Todos los derechos libres.</p>
          <div className="flex gap-6">
            {legalLinks.map((label) => (
              <Link
                key={label}
                href="/articles"
                className="text-[#76777d] no-underline"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
