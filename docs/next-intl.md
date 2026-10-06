# Soporte multiidioma del frontend

WellDone usa `next-intl` con App Router y rutas prefijadas por idioma. Actualmente se admiten castellano (`es`) e inglés (`en`), con castellano como idioma predeterminado. Esta guía explica la arquitectura y las reglas que deben seguirse al añadir páginas, enlaces o textos.
Documentación oficial de referencia:

- [Getting started con App Router](https://next-intl.dev/docs/getting-started/app-router)
- [Configuración del routing](https://next-intl.dev/docs/routing/setup)
- [APIs de navegación](https://next-intl.dev/docs/routing/navigation)

## Guía rápida

Al desarrollar una funcionalidad:

1. Añade el texto visible a `frontend/messages/es.json` y `frontend/messages/en.json`, conservando la misma estructura de claves.
2. Usa `useTranslations` en Client Components y `getTranslations` en Server Components.
3. Usa `Link`, `useRouter` y `redirect` desde `@/i18n/navigation` para navegar dentro de la aplicación.
4. No escribas manualmente rutas como `/es/articles` o `/en/articles`; usa rutas lógicas como `/articles`.
5. Ejecuta desde `frontend/`:
   ```bash
   npx tsc --noEmit
   npm run build
   ```

## Arquitectura

| Archivo                                | Responsabilidad                                                              |
| -------------------------------------- | ---------------------------------------------------------------------------- |
| `frontend/src/i18n/locales.ts`         | Declara los idiomas permitidos y el idioma predeterminado.                   |
| `frontend/src/i18n/routing.ts`         | Crea la configuración central de routing con `defineRouting`.                |
| `frontend/src/proxy.ts`                | Negocia el idioma y aplica el prefijo mediante el middleware de `next-intl`. |
| `frontend/src/i18n/request.ts`         | Resuelve el idioma de la petición y carga `messages/{locale}.json`.          |
| `frontend/src/i18n/navigation.ts`      | Exporta los wrappers localizados de navegación.                              |
| `frontend/src/i18n/locale-utils.ts`    | Expone `AppLocale` y normaliza parámetros con `resolveLocale`.               |
| `frontend/src/types/next-intl.d.ts`    | Añade tipado a los locales, namespaces y claves de mensajes.                 |
| `frontend/src/app/[locale]/layout.tsx` | Define `lang`, el provider, metadata y rutas prerenderizadas por idioma.     |
| `frontend/messages/es.json`            | Contrato principal de namespaces y claves.                                   |
| `frontend/messages/en.json`            | Traducciones inglesas con la misma estructura.                               |

Todas las páginas públicas viven bajo `app/[locale]`. Por tanto, las URLs resultantes incluyen el idioma:

```text
/es/articles
/en/articles
/es/login
/en/login
```

El código de navegación no debe construir estos prefijos manualmente.

## Cómo se resuelve el idioma

`request.ts` usa `next/root-params`, disponible en Next.js 16.3, para leer `[locale]`. Si el valor no pertenece a los locales admitidos, ejecuta `notFound()`. Si es válido, carga el JSON correspondiente:

```ts
messages: (await import(`../../messages/${locale}.json`)).default;
```

No se usa `setRequestLocale`. Es una API legacy y no debe añadirse a layouts o páginas nuevas.

### `resolveLocale` no sustituye la validación de la petición

`resolveLocale(paramLocale)` convierte un `string` de `params` en el tipo `AppLocale` y usa el idioma predeterminado como fallback. Se utiliza donde una API necesita un locale explícito y tipado, principalmente:

- `lang` del documento;
- metadata localizada;
- otros valores derivados directamente de `params.locale`.
  La validación real de rutas desconocidas sigue estando en `request.ts`, que responde con `notFound()`.
  No hace falta llamar a `resolveLocale` en todas las páginas. Para obtener el idioma actual dentro de un Server Component o Server Action, normalmente se usa:

```ts
import { getLocale } from 'next-intl/server';
const locale = await getLocale();
```

En Client Components:

```ts
import { useLocale } from 'next-intl';
const locale = useLocale();
```

## Cómo añadir y consumir mensajes

Los mensajes se agrupan por área o componente:

```json
{
  "ArticleCard": {
    "saveAria": "Guardar",
    "readMinutes": "{minutes, plural, one {# min} other {# min}}"
  }
}
```

La misma clave debe existir en inglés:

```json
{
  "ArticleCard": {
    "saveAria": "Save",
    "readMinutes": "{minutes, plural, one {# min} other {# min}}"
  }
}
```

### Client Components

```tsx
'use client';
import { useTranslations } from 'next-intl';
export function SaveButton() {
  const t = useTranslations('ArticleCard');
  return <button aria-label={t('saveAria')}>...</button>;
}
```

### Server Components

```tsx
import { getTranslations } from 'next-intl/server';
export default async function Page() {
  const t = await getTranslations('ArticlesPage');
  return <p>{t('emptySearch')}</p>;
}
```

No se debe pasar `messages` manualmente a `NextIntlClientProvider`. El provider del layout hereda los mensajes cargados por `request.ts`.

### Interpolaciones y plurales

Usa sintaxis ICU en lugar de concatenar frases:

```json
{
  "followers": "{count, plural, one {# seguidor} other {# seguidores}}"
}
```

```tsx
t('followers', { count });
```

Esto permite que cada idioma controle el orden y la gramática.

### Textos que no deben ir en los JSON

No es necesario traducir:

- valores técnicos enviados al backend, como `DRAFT` o `PUBLISHED`;
- mensajes internos de `throw new Error(...)` que no se muestran directamente;
- nombres propios;
- contenido editorial devuelto por la API, salvo que el backend proporcione versiones localizadas.
  Los errores visibles al usuario sí deben salir de los JSON, por ejemplo desde `ArticlesError`.

## Navegación interna

Importa siempre desde:

```ts
import {
  Link,
  redirect,
  usePathname,
  useRouter,
  getPathname,
} from '@/i18n/navigation';
```

### Enlaces

```tsx
<Link href="/articles">Artículos</Link>
```

`next-intl` añade automáticamente el locale actual. No uses `next/link` para navegación interna ni escribas:

```tsx
// Incorrecto
<Link href="/es/articles">Artículos</Link>
```

Para query parameters, usa el formato oficial:

```tsx
<Link
  href={{
    pathname: '/articles',
    query: { search: 'TypeScript', page: 2 },
  }}
>
  Resultados
</Link>
```

### Navegación programática

```tsx
const router = useRouter();
router.push({
  pathname: '/articles',
  query: { search, page, order },
});
```
