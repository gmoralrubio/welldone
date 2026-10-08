export const CATEGORY_SLUGS = [
  'desarrollo-web',
  'arquitectura-de-software',
  'diseno-ux-ui',
  'devops',
  'inteligencia-artificial',
  'ciberseguridad',
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export function isCategorySlug(
  value: string | null | undefined
): value is CategorySlug {
  return CATEGORY_SLUGS.some((slug) => slug === value);
}
