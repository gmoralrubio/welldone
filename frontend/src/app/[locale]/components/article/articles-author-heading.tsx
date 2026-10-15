import { ArticleDto } from '@/lib/article/articles.types';
import { getTranslations } from 'next-intl/server';

type ArticlesAuthorHeadingProps = {
  authorUsername: string;
  author?: Pick<ArticleDto['author'], 'name' | 'surname'>;
};

export async function ArticlesAuthorHeading({
  authorUsername,
  author,
}: ArticlesAuthorHeadingProps) {
  const t = await getTranslations('AuthorArticlesPage');

  return (
    <header className="pt-8">
      {author ? (
        <p className="text-sm font-medium text-muted">
          {author.name} {author.surname}
        </p>
      ) : null}
      <h1 className="font-serif text-3xl font-medium">
        {t('heading', { author: `@${authorUsername}` })}
      </h1>
    </header>
  );
}
