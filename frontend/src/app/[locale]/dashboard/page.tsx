import { getTranslations } from 'next-intl/server';

export default async function DashboardPage() {
  const t = await getTranslations('Dashboard');

  return (
    <main>
      <h1>{t('articlesTitle')}</h1>
    </main>
  );
}
