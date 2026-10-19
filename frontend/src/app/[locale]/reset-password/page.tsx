'use client';

import { Suspense, useState, type SubmitEvent } from 'react';
import { ArrowLeft, ArrowRight, Lock } from '@gravity-ui/icons';
import { Input, Label, TextField } from '@heroui/react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import LocaleSwitcher from '@/app/[locale]/components/shared/locale-switcher';

import { resetPasswordSchema } from './schema';
import { resetPassword } from './actions';

type ValidationErrorKey =
  | 'passwordRequired'
  | 'passwordPattern'
  | 'repeatPasswordRequired'
  | 'passwordsMismatch';

type FormErrorKey = 'invalidToken' | 'requestFailed';

type ResetPasswordErrors = Partial<
  Record<'password' | 'repeatPassword', ValidationErrorKey> & {
    form: FormErrorKey;
  }
>;

function ResetPasswordForm() {
  const t = useTranslations('AuthResetPassword');
  const tValidation = useTranslations('ValidationResetPassword');

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [errors, setErrors] = useState<ResetPasswordErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      setErrors({ form: 'invalidToken' });
      return;
    }

    const formData = new FormData(event.currentTarget);

    const data = {
      password: formData.get('password')?.toString() ?? '',
      repeatPassword: formData.get('repeatPassword')?.toString() ?? '',
    };

    const result = resetPasswordSchema.safeParse(data);

    if (!result.success) {
      const validationErrors: ResetPasswordErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as 'password' | 'repeatPassword';

        if (!validationErrors[field]) {
          validationErrors[field] = issue.message as ValidationErrorKey;
        }
      });

      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await resetPassword({
        token,
        password: result.data.password,
      });

      if (response.status === 200) {
        setIsSuccess(true);
      } else if (response.status === 401) {
        setErrors({ form: 'invalidToken' });
      } else {
        setErrors({ form: 'requestFailed' });
      }
    } catch {
      setErrors({ form: 'requestFailed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#faf9f6] text-[#1a1c1a] antialiased">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="text-xl font-semibold tracking-tight text-black">
          {t('brand')}
        </div>

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
              <Lock
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
                  disabled={isSubmitting || isSuccess}
                />
              </div>

              {errors.password ? (
                <p className="mt-1.5 text-xs font-medium text-[#ba1a1a]">
                  {tValidation(errors.password)}
                </p>
              ) : null}
            </TextField>

            <TextField>
              <div className="mb-1 flex items-center justify-between">
                <Label
                  isRequired
                  className="text-[12px] font-semibold text-[#45464d]"
                >
                  {t('repeatPasswordLabel')}
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
                  name="repeatPassword"
                  type="password"
                  placeholder={t('repeatPasswordPlaceholder')}
                  className="w-full pl-10"
                  disabled={isSubmitting || isSuccess}
                />
              </div>

              {errors.repeatPassword ? (
                <p className="mt-1.5 text-xs font-medium text-[#ba1a1a]">
                  {tValidation(errors.repeatPassword)}
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

            {isSuccess ? (
              <p
                className="text-sm text-[#006a63]"
                role="status"
              >
                {t('success')}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting || isSuccess || !token}
              className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-black px-5 text-sm font-semibold text-white transition-colors hover:bg-[#006a63] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? t('submitting') : t('submit')}

              <ArrowRight
                className="h-4 w-4"
                aria-hidden="true"
              />
            </button>
          </form>

          <div className="mt-6 border-t border-[#c6c6cd] pt-5 text-center">
            <Link
              href="/login"
              className="text-sm font-semibold text-black transition-colors hover:text-[#006a63]"
            >
              {t('backToLogin')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
