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
