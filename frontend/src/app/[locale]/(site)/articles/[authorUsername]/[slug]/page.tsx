import {
  getArticleByAuthorAndSlug,
  getArticleComments,
  getArticlesByAuthor,
  getCommentAuthor,
  getFavoriteArticleIds,
} from '@/app/[locale]/(site)/articles/actions';
import { authorArticlesHref, formatDate } from '@/lib/article/article-presenters';
import { Button, Card, CardContent, Chip } from '@heroui/react';
import { Check, Comment, PersonPlus } from '@gravity-ui/icons';
import { Metadata } from 'next';
import Image from 'next/image';
import { ArticleVideo } from '@/app/[locale]/components/article-detail/article-video';

import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { ArticleBreadcrumbs } from '@/app/[locale]/components/article/article-breadcrumbs';
import { MoreArticlesSlider } from '@/app/[locale]/components/article/more-articles-slider';
import { ArticleCategory } from '@/app/[locale]/components/article/article-category';
import { CommentPagination } from '@/app/[locale]/components/comment/comment-pagination';

import { parseContent } from '@/app/[locale]/(site)/articles/article-content-parser';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

import { parseCommentsQuery } from '@/lib/comment/comment-query';
import { CommentCard } from '@/app/[locale]/components/comment/comment-card';
import { CommentForm } from '@/app/[locale]/components/comment/comment-form';
import { UserAvatar } from '@/app/[locale]/components/user/user-avatar';
import { FavoriteButton } from '@/app/[locale]/components/article/favorite-button';

interface ArticleDetailPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  params: Promise<{ authorUsername: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { authorUsername, slug } = await params;

  const article = await getArticleByAuthorAndSlug(authorUsername, slug);
  if (!article) {
    notFound();
  }

  return {
    title: article.title,
    description: article.intro,
  };
}

{
}

export default async function ArticleDetailPage({
  params,
  searchParams,
}: ArticleDetailPageProps) {
  const { authorUsername, slug } = await params;
  const queryParams = await searchParams;
  const commentsPage = parseCommentsQuery(queryParams.commentsPage);

  const article = await getArticleByAuthorAndSlug(authorUsername, slug);

  if (!article) {
    notFound();
  }

  const [commentsResult, authorArticles, favoriteIds] = await Promise.all([
    getArticleComments(authorUsername, slug, commentsPage),
    getArticlesByAuthor(authorUsername, { limit: '5' }),
    getFavoriteArticleIds([article.id]),
  ]);
  const moreArticles = (authorArticles?.data ?? [])
    .filter((item) => item.slug !== slug)
    .slice(0, 4);

  const t = await getTranslations('ArticleDetailPage');
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const currentUser = accessToken ? await getCommentAuthor(accessToken) : null;
  const authorName = `${article.author.name} ${article.author.surname}`;

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-4xl flex-1 flex-col gap-8 px-6 py-10">
      <ArticleBreadcrumbs
        author={article.author}
        current={article.title}
      />

      <div className="flex items-center gap-2">
        {article.categories.map((category) => (
          <ArticleCategory
            key={category.id}
            categorySlug={category.slug}
          />
        ))}
      </div>

      <header className="flex flex-col gap-4">
        <h1 className="text-4xl xs:text-5xl sm:text-6xl tracking-tight font-serif text-balance">
          {article.title}
        </h1>

        <p className="text-lg xs:text-xl leading-7 font-serif text-muted text-balance">
          {article.intro}
        </p>

        <Card className="flex flex-col sm:flex-row justify-between xs:items-center gap-3 my-2">
          <div className="flex flex-row gap-2">
            <UserAvatar
              name={article.author.name}
              surname={article.author.surname}
              username={article.author.username}
            />
            <div className="flex flex-col">
              <div className="flex gap-2">
                <Link
                  href={`/articles/${article.author.username}`}
                  className="text-sm font-semibold text-foreground no-underline hover:underline hover:opacity-80 transition-all"
                >
                  {article.author.name} {article.author.surname}
                </Link>
                <Chip
                  size="sm"
                  color="success"
                >
                  <Check width={12} />
                  {t('following')}
                </Chip>
              </div>
              <div>
                <span className="text-xs leading-0">
                  {formatDate(article.publishedAt)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="flex gap-1 items-center px-1">
              <Comment />
              <span className="text-sm">{article.commentCount}</span>
            </div>
            <div className="flex gap-1 items-center px-1">
              <FavoriteButton
                authorUsername={article.author.username}
                slug={article.slug}
                saved={favoriteIds.includes(article.id)}
              />
            </div>
          </div>
        </Card>
      </header>

      {article.featuredImageUrl ? (
        <div className="relative aspect-video w-full overflow-hidden rounded">
          <Image
            fill
            loading="eager"
            src={article.featuredImageUrl}
            alt={article.title}
            sizes="(min-width: 56rem) 848px, calc(100vw - 3rem)"
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

      <article className="flex flex-col gap-4 text-xl leading-relaxed font-serif ">
        {parseContent(article.content)}
      </article>

      {/* Otros artículos del autor */}
      <Card
        variant="secondary"
        className="p-8"
      >
        <Card.Header>
          <div className="flex justify-between items-center gap-3">
            <div className="flex gap-2">
              <UserAvatar
                name={article.author.name}
                surname={article.author.surname}
                username={article.author.username}
                size="lg"
                className="rounded"
              />
              <div className="flex flex-col justify-center">
                <h3 className="font-serif font-bold text-xl leading-tight">
                  <Link
                    href={`/articles/${article.author.username}`}
                    className="text-foreground no-underline"
                  >
                    {article.author.name} {article.author.surname}
                  </Link>
                </h3>
                <span className="text-muted text-sm leading-tight">
                  <Link
                    href={`/articles/${article.author.username}`}
                    className="font-medium text-muted no-underline"
                  >
                    @{article.author.username}
                  </Link>{' '}
                  - {t('followers', { count: '12.2k' })}
                </span>
              </div>
            </div>
            <div>
              <Button className="bg-black text-white">
                <PersonPlus />
                {t('follow')}
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Content className="mt-4">
          <h4 className="uppercase text-sm font-medium text-muted">
            <Link
              href={authorArticlesHref(article.author.username)}
              className="text-muted no-underline"
            >
              {t('moreStories', { author: authorName })}
            </Link>
          </h4>
          {moreArticles.length > 0 ? (
            <div className="min-w-0 pt-2">
              <MoreArticlesSlider articles={moreArticles} />
            </div>
          ) : null}
        </Card.Content>
      </Card>

      <section
        id="comments"
        className="mt-4 space-y-6"
      >
        <div className="flex gap-4">
          <h3 className="text-3xl font-serif font-semibold">{t('commentsTitle')}</h3>
          <Chip
            size="md"
            variant="soft"
            color="accent"
            className="rounded-xl"
          >
            {article.commentCount}
          </Chip>
        </div>
        {currentUser ? (
          <CommentForm
            authorUsername={authorUsername}
            slug={slug}
            user={currentUser}
          />
        ) : (
          <Card>
            <CardContent>
              <Link
                href="/login"
                className="font-serif text-lg underline"
              >
                {t('loginToComment')}
              </Link>
            </CardContent>
          </Card>
        )}
        {commentsResult === null ? (
          <p
            role="alert"
            className="text-sm text-danger"
          >
            {t('commentsLoadError')}
          </p>
        ) : commentsResult.data.length === 0 && commentsResult.meta.total_items === 0 ? (
          <p className="text-muted">{t('commentsEmpty')}</p>
        ) : (
          <div className="space-y-4">
            {commentsResult.data.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                articleAuthorId={article.author.id}
                authorUsername={authorUsername}
                slug={slug}
                currentUser={currentUser}
              />
            ))}
            {commentsResult.meta.total_items > 0 ? (
              <div className="flex justify-center">
                <CommentPagination
                  authorUsername={authorUsername}
                  slug={slug}
                  page={commentsPage}
                  pages={commentsResult.meta.pages}
                />
              </div>
            ) : null}
          </div>
        )}
      </section>
    </main>
  );
}
