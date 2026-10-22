import { getMyArticleBySlug } from '@/app/[locale]/(site)/articles/actions';
import { parseContent } from '@/app/[locale]/(site)/articles/article-content-parser';
import { ArticleCategory } from '@/app/[locale]/components/article/article-category';
import { Link, redirect } from '@/i18n/navigation';
import { ArticleStatus } from '@/lib/article/articles.types';
import { Card, Chip } from '@heroui/react';
import { getTranslations, getLocale } from 'next-intl/server';
import Image from 'next/image';
import { ArticleVideo } from '@/app/[locale]/components/article-detail/article-video';
import { notFound } from 'next/navigation';

interface MyArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function MyArticlePage({ params }: MyArticlePageProps) {
  const { slug } = await params;
  const article = await getMyArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const isPublished = article.status === ArticleStatus.PUBLISHED;
  const isPastPublicationDate = article.publishedAt
    ? new Date(article.publishedAt) <= new Date()
    : true; // Si no hay fecha programada pero está publicado, asume que es visible

  if (isPublished && isPastPublicationDate) {
    const locale = await getLocale();
    redirect({ 
      href: `/articles/${article.author.username}/${article.slug}`,
      locale: locale
    });
  }

  const t = await getTranslations('Dashboard');
  const statusLabel =
    article.status === ArticleStatus.DRAFT ? t('statusDraft') : t('statusPublished');

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <Link
        href={`/dashboard/@${article.author.username}`}
        className="text-sm text-muted"
      >
        {t('backToArticles')}
      </Link>

      <div className="flex flex-wrap items-center gap-2">
        {article.categories.map((category) => (
          <ArticleCategory
            key={category.id}
            categorySlug={category.slug}
          />
        ))}
        <Chip
          variant="soft"
          color={article.status === ArticleStatus.DRAFT ? 'warning' : 'success'}
        >
          {statusLabel}
        </Chip>
      </div>

      <header className="flex flex-col gap-4">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
          {article.title}
        </h1>
        <p className="font-serif text-lg text-muted text-balance">{article.intro}</p>
      </header>

      {article.featuredImageUrl ? (
        <div className="relative aspect-video w-full overflow-hidden rounded">
          <Image
            fill
            loading="eager"
            src={article.featuredImageUrl}
            alt={article.title}
            sizes="(min-width: 48rem) 768px, calc(100vw - 4rem)"
            className="object-cover"
          />
        </div>
      ) : null}

      {article.featuredVideoUrl ? (
        <Card
            variant="transparent"
            className="overflow-hidden p-0!"
          >
          <ArticleVideo 
            url={article.featuredVideoUrl.trim()}
            poster={article.featuredImageUrl} 
          />
        </Card>
      ) : null}

      <article className="flex flex-col gap-4 font-serif text-xl leading-relaxed">
        {parseContent(article.content)}
      </article>
    </div>
  );
}
