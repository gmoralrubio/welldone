import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

export default async function ArticleNotFound() {
  const t = await getTranslations('ArticleNotFound');

  return (
    <section className="mx-auto grid max-w-xl gap-4 py-10">
      <p className="text-sm font-medium text-muted-foreground">{t('label')}</p>
      <h1 className="text-3xl font-semibold tracking-tight">{t('title')}</h1>
      <p className="text-muted-foreground">{t('description')}</p>
      <Link
        className="w-fit underline underline-offset-4"
        href="/articles"
      >
        {t('backToList')}
      </Link>
    </section>
  );
}
