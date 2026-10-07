import { getTranslations } from 'next-intl/server';
import { getMyArticlesAction } from '@/app/[locale]/articles/actions';
import { ArticleCard } from '@/app/[locale]/components/article/article-card';
import { ArticlePagination } from '@/app/[locale]/components/article/article-pagination';
import { parseArticleQuery } from '@/app/[locale]/articles/article-query';
import { Avatar, Button } from '@heroui/react';
import { Link } from '@/i18n/navigation';

interface AccountPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const t = await getTranslations('Dashboard');
  const params = await searchParams;
  
  const currentStatus = (params.status as string) || 'PUBLISHED';
  
  const { page, limit, order } = parseArticleQuery(params);

  // Le pasamos el status a la action para que el backend filtre
  const response = await getMyArticlesAction({ 
    page: String(page), 
    limit: String(limit), 
    order, 
    status: currentStatus 
  });
  const { data: articles, meta } = response;

  const user = {
    name: 'John',
    surname: 'Doe',
    username: 'jdoe',
    bio: '"Living life on my terms", && "Chasing dreams, not perfection"',
    followers: '2.3K',
  };

  // Clases CSS dinámicas para la pestaña activa vs inactiva
  const activeTabClass = "border-b border-foreground pb-3 text-sm font-medium text-foreground";
  const inactiveTabClass = "border-b border-transparent pb-3 text-sm font-medium text-muted transition-colors hover:text-foreground";

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row">
      <div className="flex flex-1 flex-col gap-6">
        <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
          {user.name} {user.surname}
        </h1>

        {/* Menú de pestañas dinámico */}
        <div className="flex w-full gap-6 border-b border-separator">
          <Link
            href="/dashboard/account?status=PUBLISHED"
            className={currentStatus === 'PUBLISHED' ? activeTabClass : inactiveTabClass}
          >
            Inicio
          </Link>
          <Link
            href="/dashboard/account?status=DRAFT"
            className={currentStatus === 'DRAFT' ? activeTabClass : inactiveTabClass}
          >
            Borradores
          </Link>
          <Link
            href="#"
            className={inactiveTabClass}
          >
            Acerca de
          </Link>
        </div>

        <div className="mt-4 flex flex-col gap-8">
          {articles.length > 0 ? (
            articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          ) : (
            <p className="text-lg text-muted">
              {currentStatus === 'DRAFT' 
                ? 'No tienes ningún borrador guardado.' 
                : 'Aún no has publicado ningún artículo.'}
            </p>
          )}
        </div>

        {meta.pages > 1 && (
          <div className="mt-4">
            <ArticlePagination page={meta.page} pages={meta.pages} search="" order={order} />
          </div>
        )}
      </div>

      {/* Sidebar*/}
      <aside className="flex w-full flex-col gap-6 pt-4 lg:w-80 lg:border-l lg:border-separator lg:pl-10">
        <Avatar size="lg" className="h-24 w-24 text-large" color="accent" variant="soft">
          <Avatar.Fallback>{user.name.charAt(0)}{user.surname.charAt(0)}</Avatar.Fallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-foreground">{user.name} {user.surname}</h2>
          <span className="text-sm text-muted">{user.followers} seguidores</span>
        </div>
        <p className="text-sm italic text-muted">{user.bio}</p>
        <div className="mt-2 flex gap-2">
          <Button size="sm" className="rounded-full bg-black font-medium text-white">Editar perfil</Button>
        </div>
      </aside>
    </div>
  );
}