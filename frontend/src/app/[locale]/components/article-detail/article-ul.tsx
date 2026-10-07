import { ReactNode } from 'react';

type ArticleUlProps = {
  children: ReactNode;
};

export function ArticleUl({ children }: ArticleUlProps) {
  return <ul className="list-disc ps-6 font-serif">{children}</ul>;
}
