import { ReactNode } from 'react';
type ArticleH2Props = {
  children: ReactNode;
};
export function ArticleH2({ children }: ArticleH2Props) {
  return (
    <h2 className="font-serif text-4xl font-medium tracking-tight text-balance">
      {children}
    </h2>
  );
}
