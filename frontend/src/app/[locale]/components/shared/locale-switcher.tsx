'use client';

import { useLocale, useTranslations } from 'next-intl';
import LocaleSwitcherSelect from './locale-switcher-select';
import { LOCALES } from '@/i18n/locales';

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();

  const items = LOCALES.map((code) => ({
    id: code,
    label: t(`options.${code}`),
  }));

  return (
    <LocaleSwitcherSelect
      items={items}
      value={locale}
      label={t('label')}
    />
  );
}
