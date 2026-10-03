import {
  formatAvatarLetter,
  formatRelativeTime,
  readingMinutes,
} from '@/app/articles/article-presenters';
import { ArticleDto } from '@/lib/articles.types';
import { Avatar, Button, Card, Chip, Link } from '@heroui/react';
import { ArrowUpFromSquare, Bookmark, Clock, Comment } from '@gravity-ui/icons';
import Image from 'next/image';

type EditorialHeroProps = {
  article: ArticleDto;
};

export function ArticleHero({ article }: EditorialHeroProps) {
  const href = `/articles/${article.author.username}/${article.slug}`;
  const minutes = readingMinutes(article.intro, article.content);

  return (
    <section className=" px-0 py-10">
      <div className="flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-accent-soft" />
          <span className="text-xs font-bold tracking-widest text-accent-soft uppercase">
            Última publicación
          </span>
          <span className="text-muted">|</span>
          <span className="font-medium text-muted">
            {formatRelativeTime(article.publishedAt)}
          </span>
        </div>
      </div>
      <Card className="mt-4 grid gap-10 bg-white p-6 shadow-xs shadow-accent-dark/30 md:p-10 lg:grid-cols-12 hover:shadow-md">
        <div className="flex flex-col justify-between gap-8 lg:col-span-7">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted mb-2">
              {article.categories.map((category) => (
                <Chip
                  key={category.id}
                  className="rounded-sm bg-accent px-2.5 py-0.5 text-xs font-bold tracking-wider text-accent-foreground uppercase"
                >
                  {category.name}
                </Chip>
              ))}
              <span>
                Publicado {formatRelativeTime(article.publishedAt).toLowerCase()}
              </span>
              <span className="text-muted">|</span>
              <span className="inline-flex items-center gap-1 text-muted">
                <Clock
                  width={12}
                  height={12}
                />
                {minutes} min de lectura
              </span>
            </div>
            <Link
              href={href}
              className="text-foreground no-underline"
            >
              <h1 className="font-serif text-4xl text-balance md:text-5xl ">
                {article.title}
              </h1>
            </Link>
            <p className="line-clamp-3 font-serif text-lg text-muted text-balance">
              {article.intro}
            </p>
          </div>
          <div className="flex items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-2">
              <Avatar size="md">
                <Avatar.Fallback>
                  {formatAvatarLetter(article.author.name, article.author.surname)}
                </Avatar.Fallback>
              </Avatar>
              <div>
                <Link
                  href={href}
                  className="text-sm font-semibold text-foreground no-underline"
                >
                  {article.author.name} {article.author.surname}
                </Link>
                <p className="text-xs text-muted">{`@${article.author.username}`}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                variant="secondary"
                size="sm"
                aria-label="Guardar"
                className="bg-surface-secondary text-foreground"
              >
                <Bookmark
                  width={14}
                  height={14}
                />
              </Button>
              <Button
                isIconOnly
                variant="secondary"
                size="sm"
                aria-label="Compartir"
                className="bg-surface-secondary text-foreground"
              >
                <ArrowUpFromSquare
                  width={14}
                  height={14}
                />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                aria-label="Comentarios"
                className="bg-surface-secondary text-foreground"
              >
                <Comment
                  width={14}
                  height={14}
                />
              </Button>
            </div>
          </div>
        </div>
        <div className="relative min-h-64 overflow-hidden rounded bg-surface-secondary lg:col-span-5 lg:min-h-96">
          {article.featuredImageUrl ? (
            <Image
              src={article.featuredImageUrl}
              alt=""
              fill
              loading="eager"
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
          ) : null}
        </div>
      </Card>
    </section>
  );
}
