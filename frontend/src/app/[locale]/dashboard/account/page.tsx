import { getTranslations } from 'next-intl/server';

export default async function AccountPage() {
  const t = await getTranslations('Dashboard');

  return <h1>{t('accountTitle')}</h1>;
}
