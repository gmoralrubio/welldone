import { getTranslations } from 'next-intl/server';

export default async function HighlightsPage() {
  const t = await getTranslations('Dashboard');

  return <h1>{t('highlightsTitle')}</h1>;
}
