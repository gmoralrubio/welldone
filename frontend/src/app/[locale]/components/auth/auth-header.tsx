import { ArrowLeft } from '@gravity-ui/icons';
import { Link } from '@/i18n/navigation';
import LocaleSwitcher from '@/app/[locale]/components/shared/locale-switcher';
import { getTranslations } from 'next-intl/server';

export default async function AuthHeader() {
  const t = await getTranslations('AuthLogin');

  return (
    <header className="sticky top-0 z-20 border-b border-separator bg-background-secondary shadow-accent-dark backdrop-blur-md">
      <div className="flex w-full items-center justify-between px-6 py-4 sm:px-8">
        <Link
          href="/articles"
          className="flex items-center gap-2 text-foreground no-underline"
        >
          <span className="grid size-8 place-items-center rounded-md bg-accent-dark pt-1 font-serif text-lg leading-0 text-accent-dark-foreground">
            W
          </span>

          <span className="pt-1 font-serif text-2xl font-semibold">WellDone</span>
        </Link>

        <div className="flex items-center gap-4">
          <LocaleSwitcher />

          <Link
            href="/articles"
            className="hidden items-center gap-2 text-sm font-medium text-[#45464d] transition-colors hover:text-black sm:flex"
          >
            <ArrowLeft
              className="h-4 w-4"
              aria-hidden="true"
            />
            {t('backToReading')}
          </Link>
        </div>
      </div>
    </header>
  );
}