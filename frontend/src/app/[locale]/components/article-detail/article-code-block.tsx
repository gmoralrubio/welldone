import { ReactNode } from 'react';

type ArticleCodeBlockProps = {
  children: ReactNode;
};

export function ArticleCodeBlock({ children }: ArticleCodeBlockProps) {
  return (
    <pre className="overflow-x-auto rounded-md bg-surface-secondary p-4 font-mono text-sm leading-relaxed">
      {children}
    </pre>
  );
}
