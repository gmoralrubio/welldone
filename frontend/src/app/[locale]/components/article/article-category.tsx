import { Chip } from '@heroui/react';

type ArticleCategoryProps = {
  name: string;
};

export function ArticleCategory({ name }: ArticleCategoryProps) {
  return (
    <Chip className="rounded-sm bg-accent/50 px-2 py-0.5 text-xs font-bold text-accent-foreground uppercase">
      {name}
    </Chip>
  );
}
