import { authorUsernameSchema } from '@/app/[locale]/(site)/articles/[authorUsername]/schema';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { PublicProfileHeader } from '@/app/[locale]/components/user/public-profile-header';
import { parseBio } from '@/lib/user/parse-bio';
import { SiteSidebar } from '@/app/[locale]/components/shared/site-sidebar';
import { parseArticleQuery } from '@/lib/article/article-query';
import { authorArticlesHref } from '@/lib/article/article-presenters';
import { SearchParamValue } from '@/lib/shared/searchParam.types';
import { cookies } from 'next/headers';
import { redirect } from '@/i18n/navigation';
import { resolveLocale } from '@/i18n/locale-utils';


type AuthorAboutPageProps = {
  params: Promise<{ locale: string; authorUsername: string }>;
  searchParams: Promise<Record<string, SearchParamValue>>;
};

export default async function AuthorAboutPage({ params, searchParams }: AuthorAboutPageProps) {
  const { authorUsername: rawAuthorUsername, locale } = await params;
  const parsedAuthor = authorUsernameSchema.safeParse(rawAuthorUsername);
  
  if (!parsedAuthor.success) notFound();
  const authorUsername = parsedAuthor.data;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  
  if (accessToken) {
    const meRes = await fetch(`${process.env.API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store'
    });
    
    if (meRes.ok) {
      const me = await meRes.json();
      if (me.username === authorUsername) {
        redirect({ href: `/dashboard/@${authorUsername}/about`, locale: resolveLocale(locale) });
      }
    }
  }

  // 1. Fetch del perfil del usuario
  const userRes = await fetch(`${process.env.API_URL}/api/users/profile/${authorUsername}`, {
    cache: 'no-store',
  });
  
  if (!userRes.ok) notFound();
  const userProfile = await userRes.json();

  // 2. Parsear query params para mantener el estado del Sidebar
  const queryParams = await searchParams;
  const criteria = parseArticleQuery(queryParams);

  const bio = userProfile.bio ? parseBio(userProfile.bio) : null;
  const tProfile = await getTranslations('PublicProfile');

  return (
    <div className="flex min-h-full flex-1 flex-col font-sans text-foreground">
      <div className="mx-auto flex w-full max-w-[1088px] flex-1 flex-col px-8">
        
        {/* Cabecera y Pestañas */}
        <div className="pt-8">
          <PublicProfileHeader user={userProfile} currentTab="ABOUT" />
        </div>

        {/* Grid de 2 columnas (Izquierda: Bio / Derecha: Sidebar) */}
        <div className="grid items-start gap-10 py-4 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          
          <section className="min-w-0">
            <div className="flex flex-col rounded-lg bg-surface-secondary p-8 mt-4">
              <h3 className="mb-6 font-serif text-xl font-bold text-foreground">
                {tProfile('aboutUser', { name: userProfile.name })}
              </h3>
              
              {bio ? (
                <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none break-words font-serif text-muted leading-relaxed">
                  {bio}
                </div>
              ) : (
                <p className="text-muted leading-relaxed italic">
                  {tProfile('emptyBio')}
                </p>
              )}
            </div>
          </section>

          {/* El mismo Sidebar que usa ArticleListing */}
          <SiteSidebar
            search={criteria.search}
            order={criteria.order}
            category={criteria.category}
            listPath={authorArticlesHref(authorUsername)} // Redirige la búsqueda a la pestaña de artículos
          />
          
        </div>
      </div>
    </div>
  );
}