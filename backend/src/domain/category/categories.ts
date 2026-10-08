export const CATEGORIES = [
  { slug: 'desarrollo-web', name: 'Desarrollo Web' },
  { slug: 'arquitectura-de-software', name: 'Arquitectura de Software' },
  { slug: 'diseno-ux-ui', name: 'Diseño UX/UI' },
  { slug: 'devops', name: 'DevOps' },
  { slug: 'inteligencia-artificial', name: 'Inteligencia Artificial' },
  { slug: 'ciberseguridad', name: 'Ciberseguridad' },
] as const; // as const para que sea inmutable

// Extrae el tipo Category slug, accediendo a cada elemento ([number]) y tomando el valor de la propiedad ['slug]
export type CategorySlug = (typeof CATEGORIES)[number]['slug'];

// Devuelve los slugs tipados
export const CATEGORY_SLUGS = CATEGORIES.map((category) => category.slug) as [
  CategorySlug,
  ...CategorySlug[],
];
