import sanitizeHtml from 'sanitize-html';

// Misma política que backend/src/infrastructure/article/sanitizers/sanitizeArticleContent.ts
export function sanitizeArticleContent(html: string): string {
  const htmlWithSpaces = html
    .replace(/&nbsp;|&#160;|&#x0*a0;/gi, ' ')
    .replace(/\u00a0/g, ' ');

  return sanitizeHtml(htmlWithSpaces, {
    allowedTags: [
      'p',
      'br',
      'h2',
      'h3',
      'strong',
      'em',
      'u',
      's',
      'ol',
      'ul',
      'li',
      'blockquote',
      'pre',
      'a',
    ],
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
