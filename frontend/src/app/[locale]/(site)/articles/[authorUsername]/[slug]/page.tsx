import {
  getArticleByAuthorAndSlug,
  getArticleComments,
  getCommentAuthor,
} from '@/app/[locale]/(site)/articles/actions';
import { formatDate, slugify, truncateSlug } from '@/lib/article/article-presenters';
import {
  Avatar,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardFooter,
  Chip,
} from '@heroui/react';
import {
  Check,
  ThumbsUp,
  Comment,
  BookmarkFill,
  ArrowUpFromSquare,
  PersonPlus,
} from '@gravity-ui/icons';
import { Metadata } from 'next';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { PaginationBasic } from '@/app/[locale]/components/shared/PaginationBasic';
import { ArticleCategory } from '@/app/[locale]/components/article/article-category';
import { CommentPagination } from '@/app/[locale]/components/comment/comment-pagination';

import { getLocale, getTranslations } from 'next-intl/server';
import { getPathname, Link } from '@/i18n/navigation';
import { parseContent } from '@/app/[locale]/(site)/articles/article-content-parser';
import { parseCommentsQuery } from '@/lib/comment/comment-query';
import { CommentCard } from '@/app/[locale]/components/comment/comment-card';
import { CommentForm } from '@/app/[locale]/components/comment/comment-form';
import { formatAvatarLetter } from '@/lib/shared/format-avatar-letter';

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
  /* TODO:
    - Imagen de Avatar
    - Calcular seguidores
    - Funcionalidad seguir
    - Funcionalidad guardar como favorito
    - Funcionalidad compartir en redes
    - Otros artículos del autor (paginados)
    - Responder con otro artículo
    - Subrayado
  */
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

  const { data: comments, meta: commentsMeta } = await getArticleComments(
    authorUsername,
    slug,
    commentsPage
  );

  const t = await getTranslations('ArticleDetailPage');
  const locale = await getLocale();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const currentUser = accessToken ? await getCommentAuthor(accessToken) : null;
  const homeHref = getPathname({ locale, href: '/' });
  const articlesHref = getPathname({ locale, href: '/articles' });
  const authorName = `${article.author.name} ${article.author.surname}`;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-10">
      <Breadcrumbs aria-label={t('breadCrumbs.ariaLabel')}>
        <Breadcrumbs.Item
          className="uppercase"
          href={homeHref}
        >
          <span className="text-xs">{t('breadCrumbs.home')}</span>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item
          className="uppercase"
          href={articlesHref}
        >
          <span className="text-xs">{t('breadCrumbs.articles')}</span>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item className="uppercase">
          <span className="text-xs">{truncateSlug(slugify(article.title))}</span>
        </Breadcrumbs.Item>
      </Breadcrumbs>

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
            <Avatar
              size="md"
              variant="soft"
              color="accent"
            >
              <Avatar.Fallback>
                {formatAvatarLetter(article.author.name, article.author.surname)}
              </Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex gap-2">
                <span className="text-sm font-semibold">
                  {article.author.name} {article.author.surname}
                </span>
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
          <div className="flex divide-x-2 divide-soft-foreground">
            <div className="flex gap-1 items-center px-3">
              <ThumbsUp />
              <span className="text-sm">1.4k</span>
            </div>
            <div className="flex gap-1 items-center px-3">
              <Comment />
              <span className="text-sm">{article.commentCount}</span>
            </div>
            <div className="flex gap-1 items-center px-3">
              <BookmarkFill className="text-success" />
            </div>
            <div className="flex gap-1 items-center px-3">
              <ArrowUpFromSquare />
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
          <video
            src={article.featuredVideoUrl}
            controls
            poster={article.featuredImageUrl ?? undefined}
            className="aspect-video w-full rounded-2xl bg-surface-secondary"
          >
            {t('videoUnsupported')}
          </video>
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
              <Avatar
                size="lg"
                variant="soft"
                color="accent"
                className="rounded"
              >
                <Avatar.Fallback>
                  {formatAvatarLetter(article.author.name, article.author.surname)}
                </Avatar.Fallback>
              </Avatar>
              <div className="flex flex-col justify-center">
                <h3 className="font-serif font-bold text-xl leading-tight">
                  {article.author.name} {article.author.surname}
                </h3>
                <span className="text-muted text-sm leading-tight">
                  <span className="font-medium">@{article.author.username}</span> -{' '}
                  {t('followers', { count: '12.2k' })}
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
            {t('moreStories', { author: authorName })}
          </h4>
          <div className="pt-2 flex flex-col sm:flex-row gap-4">
            <Card className="w-full sm:w-1/2 p-6 flex flex-col justify-between hover:shadow-md transition-shadow group">
              <div>
                <span className="uppercase text-xs font-medium text-accent">
                  Diseño web
                </span>
                <h5 className="text-xl font-serif leading-tight font-semibold text-balance mt-2 group-hover:text-accent transition-colors">
                  Every Frontend Architecture Pattern Explained
                </h5>
              </div>
              <span className="text-sm text-muted inline">
                15 de enero de 2026 | 16 likes
              </span>
            </Card>
            <Card className="w-full sm:w-1/2 p-6 flex flex-col justify-between hover:shadow-md transition-shadow group">
              <CardContent>
                <div>
                  <span className="uppercase text-xs font-medium text-accent">
                    Diseño web
                  </span>
                  <h5 className="text-xl font-serif leading-tight font-semibold text-balance mt-2 group-hover:text-accent transition-colors">
                    UI Trends That Are Actually Happening (and Worth Paying Attention To)
                  </h5>
                </div>
                <span className="text-sm text-muted inline">
                  23 de junio de 2026 | 32 likes
                </span>
              </CardContent>
            </Card>
          </div>
          <CardFooter className="mt-4">
            <PaginationBasic />
          </CardFooter>
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
        {comments.length === 0 && commentsMeta.total_items === 0 ? (
          <p className="text-muted">{t('commentsEmpty')}</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                articleAuthorId={article.author.id}
                authorUsername={authorUsername}
                slug={slug}
                currentUser={currentUser}
              />
            ))}
            {commentsMeta.total_items > 0 ? (
              <div className="flex justify-center">
                <CommentPagination
                  authorUsername={authorUsername}
                  slug={slug}
                  page={commentsPage}
                  pages={commentsMeta.pages}
                />
              </div>
            ) : null}
          </div>
        )}
      </section>
    </main>
  );
}
