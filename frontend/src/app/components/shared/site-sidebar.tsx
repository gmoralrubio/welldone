import { Surface, Link, SearchField } from '@heroui/react';
import { articleCategories } from '@/lib/articles.types';
import { SelectOrder } from '@/app/components/article/select-order';
import { ArticleOrder } from '@/app/articles/article-query';

type SiteSidebarProps = {
  search: string;
  order: ArticleOrder;
};

const frequentSearches = ['TypeScript', 'Clean Code', 'Arquitectura', 'DevOps'];

function searchHref(term: string) {
  return `/articles?search=${encodeURIComponent(term)}`;
}

export function SiteSidebar({ search, order }: SiteSidebarProps) {
  return (
    <aside className="flex flex-col gap-6">
      <Surface className="bg-surface-tertiary p-6 shadow-accent-dark rounded-3xl">
        <div>
          <p className="text-xs font-bold text-muted uppercase mb-2">Buscador</p>
        </div>
        <form
          action="/articles"
          className="mb-4"
        >
          <SearchField
            aria-label="Buscar en el índice"
            className="w-full"
            defaultValue={search}
            name="search"
          >
            <SearchField.Group className="rounded bg-field">
              <SearchField.SearchIcon />
              <SearchField.Input
                name="search"
                placeholder="Buscar por título"
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
          <p className="text-xs font-bold text-muted uppercase mb-2">Orden</p>
          <SelectOrder />
        </div>
        <div>
          <p className="text-xs font-bold text-muted uppercase mb-2">
            Búsquedas frecuentes
          </p>
          <div className="flex flex-wrap gap-2">
            {frequentSearches.map((term) => (
              <Link
                key={term}
                href={searchHref(term)}
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
          <h2 className="text-xs font-bold text-muted uppercase mb-4">Categorías</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {articleCategories.map((category) => (
            <Link
              key={category.id}
              href={searchHref(String(category.id))}
              className="rounded bg-field px-3 py-1.5 text-sm font-semibold text-foreground no-underline"
            >
              <span className="mr-1 text-muted">#</span>
              {category.name}
            </Link>
          ))}
        </div>
      </Surface>

      <Surface className="bg-accent-dark p-6 text-white shadow-md rounded-3xl">
        <p className="flex items-center gap-1 text-xs font-bold tracking-widest text-accent uppercase">
          <span className="size-1.5 rounded-full bg-[#9cf2e8]" />
          Membresía WellDone
        </p>
        <h2 className="mt-2 font-serif text-xl font-medium">
          Escribe sin fricción, publica con impacto
        </h2>
        <p className="mt-2 text-xs leading-4  text-accent-dark-foreground/70">
          Conviértete en miembro para publicar artículos enriquecidos con nuestro editor
          WYSIWYG, gestionar borradores y crear comunidad.
        </p>
        <Link
          href="/articles/create"
          className="mt-4 flex w-full items-center justify-center rounded-sm bg-surface px-4 py-2 text-sm font-semibold text-black no-underline"
        >
          Comenzar a escribir gratis
        </Link>
      </Surface>
    </aside>
  );
}
