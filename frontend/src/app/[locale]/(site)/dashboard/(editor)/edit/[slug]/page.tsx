import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ArticleForm } from '@/app/[locale]/components/article-create/article-form';
import { ArticleBreadcrumbs } from '@/app/[locale]/components/article/article-breadcrumbs';
import { getMyArticleBySlug, updateArticleAction } from '@/app/[locale]/(site)/articles/actions';
import { resolveLocale } from '@/i18n/locale-utils';

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;

  const safeLocale = resolveLocale(locale);

  const t = await getTranslations('EditArticlePage');
  const tBreadcrumbs = await getTranslations('Breadcrumbs');

  const article = await getMyArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-10">
        <ArticleBreadcrumbs
          current={tBreadcrumbs('edit')}
          asSlug={false}
          section="dashboard"
        />

        <header className="flex flex-col gap-4">
          <h1 className="text-4xl xs:text-5xl sm:text-6xl tracking-tight font-serif text-balance">
            {t('title')}
          </h1>
          <p className="text-lg xs:text-xl leading-7 font-serif text-muted text-balance">
            {t('subtitle', { title: article.title })}
          </p>
        </header>

        <ArticleForm
          action={updateArticleAction.bind(
            null,
            safeLocale,
            article.author.username,
            article.slug
          )}
          initialData={article}
        />
      </main>
    </div>
  );
}
