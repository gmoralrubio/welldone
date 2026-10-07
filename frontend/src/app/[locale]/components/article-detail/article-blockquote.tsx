import { ReactNode } from 'react';

type ArticleBlockquoteProps = {
  children: ReactNode;
};

export function ArticleBlockquote({ children }: ArticleBlockquoteProps) {
  return (
    <blockquote className="border-s-2 border-accent ps-4 font-serif italic text-muted">
      {children}
    </blockquote>
  );
}
