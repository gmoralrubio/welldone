import { getTranslations } from 'next-intl/server';

export default async function NotificationsPage() {
  const t = await getTranslations('Dashboard');

  return (
    <div className="flex w-full flex-col gap-16 lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <header className="border-b border-separator pb-4">
          <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
            {t('notificationsTitle')}
          </h1>
        </header>

        <div className="flex flex-col gap-8"></div>
      </div>

      <aside className="hidden lg:block lg:w-40 lg:shrink-0" />
    </div>
  );
}
