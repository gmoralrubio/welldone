import { getTranslations } from 'next-intl/server';

export default async function FavoritesPage() {
  const t = await getTranslations('Dashboard');

  return <h1>{t('favoritesTitle')}</h1>;
}
