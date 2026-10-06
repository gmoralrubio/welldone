'use client';

import { useState, type SubmitEvent } from 'react';
import { loginSchema, type LoginFormData } from './schema';
import { ArrowLeft, ArrowRight, At, Lock, Person } from '@gravity-ui/icons';
import { Input, Label, TextField } from '@heroui/react';
import { loginUser } from './actions';
import { Link, useRouter } from '@/i18n/navigation';
import LocaleSwitcher from '@/app/[locale]/components/shared/locale-switcher';
import { useTranslations } from 'next-intl';

type LoginFieldKey = keyof LoginFormData;
type LoginValidationKey = 'identifierRequired' | 'passwordRequired';
type LoginFormErrorKey = 'invalidCredentials' | 'loginFailed';

type LoginErrors = Partial<
  Record<LoginFieldKey, LoginValidationKey> & { form: LoginFormErrorKey }
>;

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations('AuthLogin');
  const tValidation = useTranslations('Validation.Login');
  const [errors, setErrors] = useState<LoginErrors>({});

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const data: LoginFormData = {
      identifier: formData.get('identifier')?.toString() ?? '',
      password: formData.get('password')?.toString() ?? '',
    };

    const result = loginSchema.safeParse(data);

    if (!result.success) {
      const validationErrors: LoginErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as LoginFieldKey;

        if (!validationErrors[field]) {
          validationErrors[field] = issue.message as LoginValidationKey;
        }
      });

      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const response = await loginUser(result.data);

    if (response.status === 200) {
      router.push('/articles');
      return;
    }

    if (response.status === 401 || response.status === 404) {
      setErrors({
        form: 'invalidCredentials',
      });
      return;
    }

    setErrors({ form: 'loginFailed' });
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#faf9f6] text-[#1a1c1a] antialiased">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="text-xl font-semibold tracking-tight text-black">{t('brand')}</div>

        <div className="flex items-center gap-4">
          <Link
            href="/articles"
            className="hidden items-center gap-2 text-sm font-medium text-[#45464d] transition-colors hover:text-black sm:flex"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToReading')}
          </Link>

          <LocaleSwitcher />
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-7xl flex-1 items-start justify-center px-4 pb-5 pt-1 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-md sm:p-8">
          <div className="mb-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#006a63]">
              {t('eyebrow')}
            </p>

            <div className="flex items-center gap-3">
              <Person
                className="h-7 w-7 shrink-0 text-black"
                aria-hidden="true"
              />

              <h1 className="font-serif text-[30px] font-medium leading-[38px] tracking-tight text-black">
                {t('title')}
              </h1>
            </div>

            <p className="mt-2 max-w-md text-[15px] leading-[22px] text-[#45464d]">
              {t('subtitle')}
            </p>
          </div>

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
            noValidate
          >
            <TextField>
              <div className="mb-1 flex items-center justify-between">
                <Label
                  isRequired
                  className="text-[12px] font-semibold text-[#45464d]"
                >
                  {t('identifierLabel')}
                </Label>

                <span className="text-[11px] font-medium text-[#76777d]">
                  {t('required')}
                </span>
              </div>

              <div className="relative">
                <At
                  className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#76777d]"
                  aria-hidden="true"
                />

                <Input
                  name="identifier"
                  placeholder={t('identifierPlaceholder')}
                  className="w-full pl-10"
                />
              </div>
              {errors.identifier ? (
                <p className="mt-1.5 text-xs font-medium text-[#ba1a1a]">
                  {tValidation(errors.identifier)}
                </p>
              ) : null}
            </TextField>

            <TextField>
              <div className="mb-1 flex items-center justify-between">
                <Label
                  isRequired
                  className="text-[12px] font-semibold text-[#45464d]"
                >
                  {t('passwordLabel')}
                </Label>

                <span className="text-[11px] font-medium text-[#76777d]">
                  {t('required')}
                </span>
              </div>

              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#76777d]"
                  aria-hidden="true"
                />

                <Input
                  name="password"
                  type="password"
                  placeholder={t('passwordPlaceholder')}
                  className="w-full pl-10"
                />
              </div>
              {errors.password ? (
                <p className="mt-1.5 text-xs font-medium text-[#ba1a1a]">
                  {tValidation(errors.password)}
                </p>
              ) : null}
            </TextField>

            {errors.form ? (
              <p
                className="text-xs font-medium text-[#ba1a1a]"
                role="alert"
              >
                {t(`errors.${errors.form}`)}
              </p>
            ) : null}

            <button
              type="submit"
              className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-black px-5 text-sm font-semibold text-white transition-colors hover:bg-[#006a63]"
            >
              {t('submit')}
              <ArrowRight
                className="h-4 w-4"
                aria-hidden="true"
              />
            </button>
          </form>

          <div className="mt-6 border-t border-[#c6c6cd] pt-5">
            <div className="flex items-center justify-center gap-2 text-sm">
              <p className="text-[#45464d]">{t('noAccount')}</p>

              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 font-semibold text-black transition-colors hover:text-[#006a63]"
              >
                {t('createAccount')}
                <ArrowRight
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 pb-8 pt-2 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-bold tracking-[0.06em] text-[#76777d] sm:justify-start">
          <span>{t('footerCopyright')}</span>
          <span className="text-[#c6c6cd]">•</span>
          <span>{t('footerRights')}</span>
          <span className="text-[#c6c6cd]">•</span>
          <span>{t('footerIssn')}</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-bold tracking-[0.06em] text-[#76777d]">
          <span>{t('footerProject')}</span>
          <a
            href="#"
            className="transition-colors hover:text-[#000000]"
          >
            {t('footerTerms')}
          </a>

          <a
            href="#"
            className="transition-colors hover:text-[#000000]"
          >
            {t('footerPrivacy')}
          </a>
        </div>
      </footer>
    </main>
  );
}
