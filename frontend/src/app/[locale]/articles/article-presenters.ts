const dateFormatter = new Intl.DateTimeFormat('es', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}

export function truncateSlug(slug: string): string {
  return slug.length > 20 ? slug.substring(0, 20) + '...' : slug;
}

export function slugify(input: string): string {
  if (!input) return '';

  let slug = input.toLowerCase().trim();

  // elimina acentos
  slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // elimina caracteres inválidos
  slug = slug.replace(/[^a-z0-9\s-]/g, ' ').trim();

  // reemplaza multiples espacios o guiones por unno solo
  slug = slug.replace(/[\s-]+/g, '-');

  return slug;
}

export function formatAvatarLetter(authorName: string, authorSurname: string): string {
  return authorName.charAt(0).toUpperCase().concat(authorSurname.charAt(0).toUpperCase());
}

// Cuenta las palabras y calcula el tiempo de lectura (200 palabras = 1 min)
export function readingMinutes(intro: string, content: string): number {
  const words = `${intro} ${content}`.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function getElapsedMs(isoDate: string): number {
  return Date.now() - new Date(isoDate).getTime();
}
