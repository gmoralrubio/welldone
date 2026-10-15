'use client';

import { Breadcrumbs } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';
import { getPathname } from '@/i18n/navigation';
import { authorArticlesHref, slugify } from '@/lib/article/article-presenters';

type ArticleBreadcrumbsAuthor = {
  name: string;
  surname: string;
  username: string;
};

type ArticleBreadcrumbsProps = {
  current: string;
  author?: ArticleBreadcrumbsAuthor;
};

export function ArticleBreadcrumbs({ current, author }: ArticleBreadcrumbsProps) {
  const t = useTranslations('Breadcrumbs');
  const locale = useLocale();
  const homeHref = getPathname({ locale, href: '/' });
  const articlesHref = getPathname({ locale, href: '/articles' });

  return (
    <Breadcrumbs
      aria-label={t('ariaLabel')}
      className="w-full min-w-0 flex flex-wrap"
    >
      <Breadcrumbs.Item
        className="uppercase"
        href={homeHref}
      >
        <span className="text-xs">{t('home')}</span>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item
        className="uppercase"
        href={articlesHref}
      >
        <span className="text-xs">{t('articles')}</span>
      </Breadcrumbs.Item>
      {author ? (
        <Breadcrumbs.Item
          className="uppercase"
          href={getPathname({
            locale,
            href: authorArticlesHref(author.username),
          })}
        >
          <span className="text-xs">
            {author.name} {author.surname}
          </span>
        </Breadcrumbs.Item>
      ) : null}
      <Breadcrumbs.Item className="min-w-0 max-w-full shrink! overflow-hidden uppercase **:data-slot=link]]:block **:data-slot=link]]:min-w-0 **:data-[slot=link]:max-w-full **:data-[slot=link]:overflow-hidden">
        <span className="block w-full min-w-0 truncate text-xs">{slugify(current)}</span>
      </Breadcrumbs.Item>
    </Breadcrumbs>
  );
}
