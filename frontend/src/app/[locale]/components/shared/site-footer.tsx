'use client';

import { Chip } from '@heroui/react';
import { Link } from '@/i18n/navigation';
import LocaleSwitcher from '@/app/[locale]/components/shared/locale-switcher';
import { useTranslations } from 'next-intl';

export function SiteFooter() {
  const t = useTranslations('SiteFooter');

  const publicationLinks = [
    { key: 'github' as const, href: '/articles' as const },
    { key: 'apiDocs' as const, href: '/articles' as const },
  ];

  const legalLinks = [
    { key: 'privacy' as const, href: '/articles' as const },
    { key: 'terms' as const, href: '/articles' as const },
  ];

  return (
    <footer className="mt-16 bg-surface-tertiary">
      <div className="mx-auto grid w-full max-w-340 gap-16 px-8 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-semibold text-foreground">
                WellDone
              </span>
              <Chip className="rounded-sm bg-accent px-2 text-[10px] tracking-wide text-accent-foreground uppercase">
                KeepCoding Certified
              </Chip>
            </div>
            <p className="mt-2 max-w-md font-serif text-lg text-muted">{t('tagline')}</p>
          </div>
          <div>
            <h2 className="text-[11px] font-bold tracking-[0.55px] text-[#76777d] uppercase">
              {t('publication')}
            </h2>
            <ul className="mt-2 space-y-1">
              {publicationLinks.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-sm font-semibold text-[#45464d] no-underline"
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-[11px] font-bold tracking-[0.55px] text-[#76777d] uppercase">
              {t('platform')}
            </h2>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-[0.66px] text-[#76777d] uppercase">
                {t('language')}
              </span>
              <LocaleSwitcher />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 border-t border-[#e3e2e0] pt-6 text-xs tracking-[0.24px] text-[#76777d] sm:flex-row sm:items-center sm:justify-between">
          <p>{t('copyright')}</p>
          <div className="flex gap-6">
            {legalLinks.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                className="text-[#76777d] no-underline"
              >
                {t(key)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
