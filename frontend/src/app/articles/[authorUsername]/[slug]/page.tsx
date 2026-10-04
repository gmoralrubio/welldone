import { getArticleByAuthorAndSlug } from '@/app/articles/actions';
import {
  formatAvatarLetter,
  formatDate,
  slugify,
  truncateSlug,
} from '@/app/articles/article-presenters';
import {
  Avatar,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Chip,
  TextArea,
} from '@heroui/react';
import {
  Check,
  ThumbsUp,
  Comment,
  BookmarkFill,
  ArrowUpFromSquare,
  PersonPlus,
  Bold,
  QuoteOpen,
  Code,
} from '@gravity-ui/icons';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PaginationBasic } from '@/app/components/shared/PaginationBasic';
import { PaginationSimplePrevNext } from '@/app/components/shared/PaginationSimplePrevNext';
import { ArticleCategory } from '@/app/components/article/article-category';

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

{
  /* TODO:
    - Loading
    - Incluir categorías
    - Imagen de Avatar
    - Calcular seguidores
    - Calcular comentarios
    - Funcionalidad seguir
    - Funcionalidad guardar como favorito
    - Funcionalidad compartir en redes
    - Otros artículos del autor (paginados)
    - Comentarios (paginados)
    - Responder con otro artículo
    - Subrayado
  */
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { authorUsername, slug } = await params;

  const article = await getArticleByAuthorAndSlug(authorUsername, slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-10">
      <Breadcrumbs aria-label="Migas de pan">
        <Breadcrumbs.Item
          className="uppercase"
          href="/"
        >
          <span className="text-xs">Inicio</span>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item
          className="uppercase"
          href="/articles"
        >
          <span className="text-xs">Artículos</span>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item className="uppercase">
          <span className="text-xs">{truncateSlug(slugify(article.title))}</span>
        </Breadcrumbs.Item>
      </Breadcrumbs>

      <div className="flex gap-2">
        {article.categories.map((category) => (
          <ArticleCategory
            key={category.id}
            name={category.name}
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
                  Siguiendo
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
              <span className="text-sm">24</span>
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
            Tu navegador no reproduce este vídeo.
          </video>
        </Card>
      ) : null}

      <article className="flex flex-col gap-4 text-xl leading-relaxed font-serif">
        {article.content}
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
                  <span className="font-medium">@{article.author.username}</span> - 12.2k
                  seguidores
                </span>
              </div>
            </div>
            <div>
              <Button className="bg-black text-white">
                <PersonPlus />
                Seguir
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Content className="mt-4">
          <h4 className="uppercase text-sm font-medium text-muted">
            Más historias de {article.author.name} {article.author.surname}
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

      {/* Comentarios */}
      <section className="mt-4 space-y-6">
        <div className="flex gap-4">
          <h3 className="text-3xl font-serif font-semibold">Comentarios</h3>
          <Chip
            size="md"
            variant="soft"
            color="accent"
            className="rounded-xl"
          >
            20
          </Chip>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Avatar
              size="md"
              variant="soft"
              color="accent"
            >
              <Avatar.Fallback>
                {formatAvatarLetter(article.author.name, article.author.surname)}
              </Avatar.Fallback>
            </Avatar>
            <span>Escribe una respuesta...</span>
          </CardHeader>
          <CardContent>
            <TextArea
              fullWidth
              placeholder="Comparte tu conocimiento"
              variant="secondary"
            />
          </CardContent>
          <CardFooter>
            <div className="flex flex-row items-center gap-4">
              <Bold className="text-muted hover:text-black" />
              <QuoteOpen className="text-muted hover:text-black" />
              <Code className="text-muted hover:text-black" />
            </div>
            <Button className="bg-black text-white ml-auto mt-2">
              Publicar respuesta
            </Button>
          </CardFooter>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader>
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
                    <span className="text-sm font-semibold">Jane Doe</span>
                    <Chip size="sm">Miembro</Chip>
                  </div>
                  <div>
                    <span className="text-xs leading-0">hace 2 horas</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-serif text-lg">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum accusamus
                fugit rem soluta optio praesentium explicabo, vero rerum in tempora? Ex
                sunt mollitia, repudiandae autem sint ducimus natus ratione. Beatae
                corrupti quod tempore consequuntur porro dolorem explicabo quidem, nostrum
                amet illo sunt, numquam omnis! Esse labore ducimus vitae ipsam
                exercitationem!
              </p>
            </CardContent>
            <CardFooter className="gap-4">
              <div className="flex flex-row items-center gap-1">
                <ThumbsUp className="text-muted hover:text-foreground" />
                <span className="text-sm text-muted">24</span>
              </div>
              <span className="text-sm text-muted">Responder</span>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
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
                    <span className="text-sm font-semibold">Jane Doe</span>
                    <Chip size="sm">Miembro</Chip>
                  </div>
                  <div>
                    <span className="text-xs leading-0">hace 2 horas</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-serif text-lg">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum accusamus
              </p>
            </CardContent>
            <CardFooter className="gap-4">
              <div className="flex flex-row items-center gap-1">
                <ThumbsUp className="text-muted hover:text-foreground" />
                <span className="text-sm text-muted">24</span>
              </div>
              <span className="text-sm text-muted">Responder</span>
            </CardFooter>
            <div className="w-15/16 ml-auto">
              <Card variant="tertiary">
                <CardHeader>
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
                        <span className="text-sm font-semibold">Jane Doe</span>
                        <Chip
                          size="sm"
                          color="success"
                          variant="soft"
                        >
                          Autor
                        </Chip>
                      </div>
                      <div>
                        <span className="text-xs leading-0">hace 1 hora</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-serif text-lg">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum accusamus
                  </p>
                </CardContent>
              </Card>
            </div>
          </Card>
          <div className="flex justify-center">
            {/* Center the pagination */}
            <div className="flex justify-center">
              <PaginationSimplePrevNext />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
