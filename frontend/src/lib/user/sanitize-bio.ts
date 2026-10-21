import sanitizeHtml from 'sanitize-html';

// Misma política que backend/src/infrastructure/user/sanitizers/sanitizeBio.ts
// Sin server-only: también lo usa el editor de bio, que es un Client Component.
export function sanitizeBio(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ['p', 'br', 'strong', 'em', 'ol', 'ul', 'li', 'a'],
    allowedAttributes: {
      a: ['href', 'rel', 'target'],
    },
    allowedSchemes: ['http', 'https'],
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attribs) => {
        if (attribs.target === '_blank') {
          return {
            tagName,
            attribs: {
              ...attribs,
              rel: 'noopener noreferrer',
            },
          };
        }

        return { tagName, attribs };
      },
    },
  });
}
