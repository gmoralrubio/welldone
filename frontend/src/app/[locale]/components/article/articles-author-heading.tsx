import { ArticleBreadcrumbs } from '@/app/[locale]/components/article/article-breadcrumbs';
import { ArticleDto } from '@/lib/article/articles.types';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

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
    <div className="flex flex-col gap-4 pt-8">
      <ArticleBreadcrumbs
        current={author ? `${author.name} ${author.surname}` : `@${authorUsername}`}
      />
      <header>
        <h1 className="font-serif text-3xl font-medium">
          {t('heading', { author: ' ' })}
          <Link 
            href={`/dashboard/@${authorUsername}`}
            className="underline decoration-1 underline-offset-4 hover:text-accent transition-colors"
          >
            @{authorUsername}
          </Link>
        </h1>
      </header>
    </div>
  );
}
