import { ReactNode } from 'react';
type ArticleH3Props = {
  children: ReactNode;
};
export function ArticleH3({ children }: ArticleH3Props) {
  return (
    <h3 className="font-serif text-2xl font-medium tracking-tight text-balance">
      {children}
    </h3>
  );
}
