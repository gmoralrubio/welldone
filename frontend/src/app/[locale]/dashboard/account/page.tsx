import { cookies } from 'next/headers';
import { getLocale, getTranslations } from 'next-intl/server';
import { redirect, Link } from '@/i18n/navigation';
import AccountForm from './account-form';
import { getMyArticlesAction } from '@/app/[locale]/articles/actions';
import { ArticleCard } from '@/app/[locale]/components/article/article-card';
import { ArticlePagination } from '@/app/[locale]/components/article/article-pagination';
import { parseArticleQuery } from '@/app/[locale]/articles/article-query';
import { Avatar, Button } from '@heroui/react';
import { ArticleDto } from '@/lib/articles.types';

interface AccountPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

interface UserProfile {
  id: number;
  name: string;
  surname: string;
  username: string;
  email: string;
}


export default async function AccountPage({ searchParams }: AccountPageProps) {
  const t = await getTranslations('Dashboard');
  const locale = await getLocale();


  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return redirect({ href: '/login', locale });
  }

  const response = await fetch(`${process.env.API_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (response.status === 401) {
    return redirect({ href: '/login', locale });
  }

  if (!response.ok) {
    throw new Error('Could not load user profile');
  }

  const user: UserProfile = await response.json();


  const params = await searchParams;
  const currentStatus = (params.status as string) || 'PUBLISHED';
  const { page, limit, order } = parseArticleQuery(params);

  let articles: ArticleDto[] = [];

  let meta = { page: 1, pages: 1 };
  
  if (currentStatus !== 'ABOUT') {
    const articlesResponse = await getMyArticlesAction({ 
      page: String(page), 
      limit: String(limit), 
      order, 
      status: currentStatus 
    });
    articles = articlesResponse.data;
    meta = articlesResponse.meta;
  }

  const activeTabClass = "border-b border-foreground pb-3 text-sm font-medium text-foreground";
  const inactiveTabClass = "border-b border-transparent pb-3 text-sm font-medium text-muted transition-colors hover:text-foreground";

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row">
      <div className="flex flex-1 flex-col gap-6">
        <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
          {user.name} {user.surname}
        </h1>

        <div className="flex w-full gap-6 border-b border-separator">
          <Link
            href="/dashboard/account?status=PUBLISHED"
            className={currentStatus === 'PUBLISHED' ? activeTabClass : inactiveTabClass}
          >
            {t('tabs.home')}
          </Link>
          <Link
            href="/dashboard/account?status=DRAFT"
            className={currentStatus === 'DRAFT' ? activeTabClass : inactiveTabClass}
          >
            {t('tabs.drafts')}
          </Link>
          <Link
            href="/dashboard/account?status=ABOUT"
            className={currentStatus === 'ABOUT' ? activeTabClass : inactiveTabClass}
          >
            {t('tabs.about')}
          </Link>
        </div>

        <div className="mt-4 flex flex-col gap-8">
          {currentStatus === 'ABOUT' ? (
            <section className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">{t('accountTitle')}</h2>
              </div>
              <AccountForm
                user={{
                  name: user.name,
                  surname: user.surname,
                  username: user.username,
                  email: user.email,
                }}
              />
            </section>
          ) : articles.length > 0 ? (
            articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          ) : (
            <p className="text-lg text-muted">
              {currentStatus === 'DRAFT' 
                ? t('emptyStates.drafts') 
                : t('emptyStates.published')}
            </p>
          )}
        </div>

        {currentStatus !== 'ABOUT' && meta.pages > 1 && (
          <div className="mt-4">

            <ArticlePagination page={meta.page} pages={meta.pages} search="" order={order} category="" />
          </div>
        )}
      </div>

      <aside className="flex w-full flex-col gap-6 pt-4 lg:w-80 lg:border-l lg:border-separator lg:pl-10">
        <Avatar size="lg" className="h-24 w-24 text-large" color="accent" variant="soft">
          <Avatar.Fallback>{user.name.charAt(0)}{user.surname.charAt(0)}</Avatar.Fallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-foreground">{user.name} {user.surname}</h2>
          <span className="text-sm text-muted">@{user.username}</span>
        </div>
        
        <div className="mt-2 flex gap-2">
          <Link href="/dashboard/account?status=ABOUT">
            <Button size="sm" className="rounded-full bg-black font-medium text-white">
              {t('editProfile')}
            </Button>
          </Link>
        </div>
      </aside>
    </div>
  );
}