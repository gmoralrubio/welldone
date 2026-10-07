import { ReactNode } from 'react';
type ArticleH2Props = {
  children: ReactNode;
};
export function ArticleH3({ children }: ArticleH2Props) {
  return (
    <h2 className="font-serif text-2xl font-medium tracking-tight text-balance">
      {children}
    </h2>
  );
}
