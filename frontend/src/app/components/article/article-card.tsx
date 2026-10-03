import {
  formatAvatarLetter,
  formatRelativeTime,
  readingMinutes,
} from '@/app/articles/article-presenters';
import { ArticleDto } from '@/lib/articles.types';
import { Avatar, Button, Card, Chip, Link } from '@heroui/react';
import { ArrowUpFromSquare, Bookmark, Clock, Comment } from '@gravity-ui/icons';
import Image from 'next/image';

type ArticleCardProps = {
  article: ArticleDto;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const href = `/articles/${article.author.username}/${article.slug}`;
  const minutes = readingMinutes(article.intro, article.content);

  return (
    <Card className="flex flex-col gap-4 bg-white p-6 shadow-xs shadow-accent-dark/30 hover:shadow-md sm:flex-row sm:items-stretch">
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <Avatar
              size="sm"
              className="size-6"
            >
              <Avatar.Fallback className="text-[10px]">
                {formatAvatarLetter(article.author.name, article.author.surname)}
              </Avatar.Fallback>
            </Avatar>
            <Link
              href={href}
              className="text-xs font-semibold text-foreground no-underline"
            >
              {article.author.name} {article.author.surname}
            </Link>
            <span className="text-muted">|</span>
            <span>{formatRelativeTime(article.publishedAt)}</span>
          </div>
          <Link
            href={href}
            className="text-foreground no-underline"
          >
            <h2 className="font-serif text-2xl font-medium text-balance">
              {article.title}
            </h2>
          </Link>
          <p className="line-clamp-2 font-serif text-lg text-muted">{article.intro}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            {article.categories.map((category) => (
              <Chip
                key={category.id}
                className="rounded-sm bg-accent/50 px-2 py-0.5 text-xs font-bold text-accent-foreground uppercase"
              >
                {category.name}
              </Chip>
            ))}
            <span className="inline-flex items-center gap-1">
              <Clock
                width={12}
                height={12}
              />
              {minutes} min
            </span>
          </div>
          <div className="flex items-center">
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              aria-label="Comentarios"
            >
              <Comment
                width={14}
                height={14}
              />
            </Button>
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              aria-label="Guardar"
            >
              <Bookmark
                width={14}
                height={14}
              />
            </Button>
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              aria-label="Compartir"
            >
              <ArrowUpFromSquare
                width={14}
                height={14}
              />
            </Button>
          </div>
        </div>
      </div>
      <div className="relative w-full shrink-0 overflow-hidden rounded bg-surface-secondary sm:w-48">
        {article.featuredImageUrl ? (
          <Image
            src={article.featuredImageUrl}
            alt=""
            fill
            loading="eager"
            className="size-full object-cover"
          />
        ) : null}
      </div>
    </Card>
  );
}
