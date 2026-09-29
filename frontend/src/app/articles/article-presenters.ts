const dateFormatter = new Intl.DateTimeFormat('en', {
  dateStyle: 'medium',
});

export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}
