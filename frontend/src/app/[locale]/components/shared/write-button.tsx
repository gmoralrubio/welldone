'use client';

import { Pencil } from '@gravity-ui/icons';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

const WriteButton = () => {
  const t = useTranslations('SiteHeader');

  return (
    <Link
      href="/articles/create"
      className="inline-flex items-center gap-1.5 rounded bg-accent-soft px-3 py-1.5 text-sm font-semibold text-accent-soft-foreground no-underline"
    >
      <Pencil
        width={15}
        height={15}
      />
      {t('write')}
    </Link>
  );
};

export default WriteButton;
