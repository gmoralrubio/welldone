import { ReactNode } from 'react';

type ArticleOlProps = {
  children: ReactNode;
};

export function ArticleOl({ children }: ArticleOlProps) {
  return <ol className="list-decimal ps-6 font-serif">{children}</ol>;
}
