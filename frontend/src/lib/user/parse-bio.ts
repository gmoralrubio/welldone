import parse from 'html-react-parser';
import { ReactNode } from 'react';
import { sanitizeBio } from '@/lib/user/sanitize-bio';

// Sin server-only: el editor de bio es un Client Component.
export function parseBio(html: string): ReactNode | null {
  const safeHtml = sanitizeBio(html).trim();

  if (!safeHtml) {
    return null;
  }

  return parse(safeHtml);
}
