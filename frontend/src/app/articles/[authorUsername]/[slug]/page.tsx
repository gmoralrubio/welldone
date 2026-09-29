import { getArticleByAuthorAndSlug } from '@/app/articles/actions';
import { formatDate } from '@/app/articles/article-presenters';
import { Avatar, Breadcrumbs, Card, Separator } from '@heroui/react';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface ArticleDetailPageProps {
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

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { authorUsername, slug } = await params;

  const article = await getArticleByAuthorAndSlug(authorUsername, slug);
  if (!article) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-10">
        <Breadcrumbs aria-label="Migas de pan">
          <Breadcrumbs.Item href="/">Inicio</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/articles">Artículos</Breadcrumbs.Item>
          <Breadcrumbs.Item>{article.title}</Breadcrumbs.Item>
        </Breadcrumbs>

        <header className="flex flex-col gap-4">
          <h1 className="text-4xl font-semibold tracking-tight">{article.title}</h1>

          <p className="text-lg leading-7 text-muted">{article.intro}</p>

          <div className="flex items-center gap-3">
            <Avatar size="sm">
              <Avatar.Fallback>{authorUsername}</Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Autor #{authorUsername}</span>
            </div>
          </div>
        </header>

        {article.featuredImageUrl ? (
          <Card
            variant="transparent"
            className="overflow-hidden p-0!"
          >
            <Image
              src={article.featuredImageUrl}
              alt={article.title}
              className="aspect-video w-full rounded-2xl object-cover"
            />
          </Card>
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
              Tu navegador no reproduce este vídeo.
            </video>
          </Card>
        ) : null}

        <Separator />

        <article className="flex flex-col gap-4 text-base leading-7">
          {article.content}
        </article>

        <Separator />

        <Card variant="secondary">
          <Card.Header>
            <Card.Title>Detalles</Card.Title>
          </Card.Header>
          <Card.Content>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <dt className="text-sm text-muted">Slug</dt>
                <dd className="text-sm">{article.slug}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-sm text-muted">Id</dt>
                <dd className="text-sm">{article.id}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-sm text-muted">Creado</dt>
                <dd className="text-sm">
                  <p>{formatDate(article.createdAt)}</p>
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-sm text-muted">Actualizado</dt>
                <dd className="text-sm">
                  <p>{formatDate(article.updatedAt)}</p>
                </dd>
              </div>
            </dl>
          </Card.Content>
        </Card>
      </main>
    </div>
  );
}
