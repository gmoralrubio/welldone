import sanitizeHtml from 'sanitize-html';

// Misma política que frontend/src/lib/user/sanitize-bio.ts
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
