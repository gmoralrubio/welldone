export function formatAvatarLetter(authorName: string, authorSurname: string): string {
  return authorName.charAt(0).toUpperCase().concat(authorSurname.charAt(0).toUpperCase());
}
