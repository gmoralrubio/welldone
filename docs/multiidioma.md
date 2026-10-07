# Front multiidioma con next-intl

- Se usa `next-intl` para setear el idioma (`/es`, `/en`) en la url y gestionar la navegación manteniendo el idioma seleccionado. Esta librería lo que hace es leer el locale (idioma) del usuario, exponerlo en la aplicación y apliacarlo a la url (http://localhost:3000/es/articles)
- Todas las páginas públicas cuelgan de `app/[locale]`. Así todas las urls incluyen el idioma:

```
/es/articles
/en/articles
/es/users/login
/en/users/login
```

- Toda la navegación interna necesita el locale, para que al navegar a la página de destino (con un redirect, useRouter, Link) se aplique el idioma
- Documentación de la librería `next-intl`: https://next-intl.dev/docs/getting-started/app-router

## Diccionarios con los textos

- Los textos se encuentran mapeados en `frontend/messages/es.json` y `frontend/messages/en.json`. Para añadir un texto, se añade una nueva key parra la página/componente y se añaden propiedades con el valor

- Los mensajes se agrupan por área o componente:

```json
{
  "CreateArticlePage": {
    "title": "Escribe tu historia",
    "subtitle": "Comparte tus conocimientos con la comunidad."
  }
}
```

- La misma clave debe existir en inglés:

```json
{
  "CreateArticlePage": {
    "title": "Write your story",
    "subtitle": "Share your knowledge with the community."
  }
}
```

### Interpolaciones (textos dinámicos)

- La libría permite hacer interpolaciones y plurales
- [Guía de uso](https://next-intl.dev/docs/usage)

```json
{
  "followers": "{count, plural, one {# seguidor} other {# seguidores}}"
}
```

```tsx
t('followers', { count });
```

## Uso en Client Components ('use client')

- Para usar los textos:
  - Si es un componente de Cliente se usa `useTranslations()`:

  ```tsx
  'use client';
  import { useTranslations } from 'next-intl';

  export function ArticleHero() {
    // trae las traducciones del Componente Cliente
    const t = useTranslations('ArticleHero');
    // pinta el texto de heading
    return <div>{t('heading')}</div>;
  }
  ```

## Uso en Server Components

- Si es un componente de Servidor se usa `getTranslations()` (asíncrono):

```tsx
import { getTranslations } from 'next-intl/server';

export async function ArticlesPage() {}
// trae las traducciones de la página
const t = await getTranslations('ArticlesPage');
// pinta el texto de heading
return <div>{t('heading')}</div>;
```

## Obtener el locale

- Para obtener el locale:
  - En **Client Components**:

  ```ts
  import { useLocale } from 'next-intl';

  const locale = useLocale();
  ```

  - En un **Server Component** (page o layout):

  ```ts
  import { getLocale } from 'next-intl/server';

  const locale = await getLocale();
  ```

  - En una **Server Action** o un **Route Handler**: no uses `getLocale()`. Ver [Server Actions](#server-actions).

## Server Actions

`getLocale()` dentro de una Server Action lanza este error:

```
Error: `import('next/root-params').locale()` was used inside a Server Action. This is not supported. Functions from 'next/root-params' can only be called in the context of a route.
```

`getRequestConfig` en `frontend/src/i18n/request.ts` lee el segmento `[locale]` con `next/root-params` cuando no recibe un locale explícito. Esa API solo funciona en una ruta (page, layout). Una Server Action no es ese contexto. Lo mismo pasa en Route Handlers. next-intl lo documenta: el soporte en acciones y handlers llega en una versión posterior de Next.js.

El locale se obtiene en el Client Component con `useLocale()` y se pasa a la action con `bind`. Next entrega `FormData` como último argumento; el locale va primero. Dentro de la action se valida con `resolveLocale` antes del `redirect`, para descartar un valor que no sea `es` o `en`.

```tsx
'use client';

import { useLocale } from 'next-intl';
import { createArticleAction } from '../actions';

const locale = useLocale();

<form action={createArticleAction.bind(null, locale)}>{/* ... */}</form>;
```

```ts
'use server';

import { redirect } from '@/i18n/navigation';
import { resolveLocale } from '@/i18n/locale-utils';

export async function createArticleAction(locale: string, formData: FormData) {
  // ...crear el artículo...

  redirect({
    href: `/articles/${article.author.username}/${article.slug}`,
    locale: resolveLocale(locale),
  });
}
```

Si la action necesita textos, pasa ese locale a `getTranslations`. Así `request.ts` no llama a `rootParams.locale()`:

```ts
const t = await getTranslations({
  locale: resolveLocale(locale),
  namespace: 'CreateArticlePage',
});
```

## Navegación

- No se deben usar rutas como `/es/articles` o `/en/articles`, ya que es la librería la que automáticamente mete el locale en la url. Hay que usar rutas como `/articles`.

- Para navegar dentro de la aplicación hay que usar `Link`, `useRouter` y `redirect` desde `@/i18n/navigation`, no desde `next` o `@heroui/react` .

```ts
import {
  Link,
  redirect,
  usePathname,
  useRouter,
  getPathname,
} from '@/i18n/navigation';
```

### Link

- Se usan los de `'@/i18n/navigation'`

```tsx
import { Link } from '@/i18n/navigation';

<Link href="/articles">Artículos</Link>;

// Incorrecto
<Link href="/es/articles">Artículos</Link>;
```

Si el link lleva parametros de query, usar:

```tsx
<Link
  href={{
    pathname: '/articles',
    // para busqueda, por ejempo
    query: { search: 'TypeScript', page: 2 },
  }}
>
  Resultados
</Link>
```

### useRouter()

- Lo mismo, se usan los de `'@/i18n/navigation'`

```tsx
import { useRouter } from '@/i18n/navigation';

const router = useRouter();

router.push({
  pathname: '/articles',
  query: { search, page, order },
});
```

### redirect()

- Al `redirect` hay que pasarle un locale explícito.
- En un Server Component de una ruta, ese locale sale de `getLocale()`:

```ts
import { redirect } from '@/i18n/navigation';
import { getLocale } from 'next-intl/server';

const locale = await getLocale();
redirect({ href: '/articles', locale });
```

- En una Server Action, `getLocale()` falla. Pasa el locale desde el cliente. Ver [Server Actions](#server-actions).

### Links HeroUI

- Cuando un componente de HeroUI necesita una url, como `Breadcrumbs.Item`, se usa `getPathname` (añade el locale)

```tsx
const locale = useLocale();
const articlesHref = getPathname({ locale, href: '/articles' });

<Breadcrumbs.Item href={articlesHref}>
  {t('breadCrumbsArticles')}
</Breadcrumbs.Item>;
```

Si HeroUI `Link` solo aporta estilos, sustitúyelo por el `Link` de `@/i18n/navigation` y conserva las clases:

```tsx
import { Link } from '@/i18n/navigation';

<Link
  href="/articles/create"
  className="rounded bg-accent px-3 py-2 no-underline"
>
  Escribir
</Link>;
```

### Formularios GET

Lo mismo con formularios GET:

```tsx
const action = getPathname({ locale, href: '/articles' });

<form action={action}>
  <input name="search" />
</form>;
```

En una Server Action, pasa el locale desde el cliente y valídalo con `resolveLocale`. Ver [Server Actions](#server-actions). En metadata o código que ya recibe `params.locale`, usa `resolveLocale`.

## Metadata y generateMetadata()

- En los metadata se usa el helper `resolveLocale(paramLocale)`, que convierte el parametro locale de la url (`en` o `es`) en un parámetro tipado, usando el idioma predeterminado como fallback. Se usa en las páginas con `Metadata` donde se necesita el locale explícito:

```tsx
export async function generateMetadata({ params }) {
  // Parametro locale de la url
  const { locale: paramLocale } = await params;
  // Devuleve el locale de esta página
  const locale = resolveLocale(paramLocale);
  const t = await getTranslations({
    locale,
    namespace: 'AppMetadata',
  });

  return {
    title: t('articlesTitle'),
    description: t('articlesDescription'),
  };
}
```

## Validación de formularios

- Los schemas Zod devuelven claves estables, que se traducen en el diccionario

```json
{
  "Validation": {
    "Login": {
      "identifierRequired": "El email o nombre de usuario es obligatorio",
      "passwordRequired": "La contraseña es obligatoria"
    }
  }
}
```

```ts
// schema Zod
z.string().min(1, 'passwordRequired');
```

En el front se llama a la traducción a partir de la clave:

```tsx
const tValidation = useTranslations('Validation.Login');

tValidation(issue.message as 'passwordRequired');
```

## Selector de idioma

`LocaleSwitcher` permite cambiar entre idiomas, se puede reutilizar
