import { getTranslations } from 'next-intl/server';

export default async function NotificationsPage() {
  const t = await getTranslations('Dashboard');

  return <h1>{t('notificationsTitle')}</h1>;
}
