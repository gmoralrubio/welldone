const dateFormatter = new Intl.DateTimeFormat('en', {
  dateStyle: 'medium',
});

export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}

export function slugify(input: string): string {
  if (!input) return '';

  let slug = input.toLowerCase().trim();

  // el slug se limita a 10 palabras
  slug = slug.split(/\s+/).slice(0, 8).join(' ');

  // elimina acentos
  slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // elimina caracteres inválidos
  slug = slug.replace(/[^a-z0-9\s-]/g, ' ').trim();

  // reemplaza multiples espacios o guiones por unno solo
  slug = slug.replace(/[\s-]+/g, '-');

  return slug;
}
