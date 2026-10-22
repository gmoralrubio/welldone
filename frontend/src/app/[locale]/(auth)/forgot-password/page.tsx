'use client';

import { useState, type SubmitEvent } from 'react';
import { ArrowRight, At } from '@gravity-ui/icons';
import { Input, Label, TextField } from '@heroui/react';
import { Link } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';

import { forgotPasswordSchema } from './schema';
import { forgotPassword } from './actions';

type ForgotPasswordError =
  | 'emailRequired'
  | 'emailInvalid'
  | 'requestFailed'
  | 'tooManyRequests'
  | null;

export default function ForgotPasswordPage() {
  const t = useTranslations('AuthForgotPassword');
  const tValidation = useTranslations('ValidationForgotPassword');
  const locale = useLocale();

  const [error, setError] = useState<ForgotPasswordError>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email')?.toString() ?? '';

    const result = forgotPasswordSchema.safeParse({ email });

    if (!result.success) {
      setError(result.error.issues[0].message as 'emailRequired' | 'emailInvalid');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await forgotPassword({
        email: result.data.email,
        locale: locale === 'en' ? 'en' : 'es',
      });

      if (response.status === 200) {
        setIsSuccess(true);
      } else if (response.status === 429) {
        setError('tooManyRequests');
      } else {
        setError('requestFailed');
      }
    } catch {
      setError('requestFailed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-1 items-start justify-center px-4 pb-5 pt-1 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-md sm:p-8">
        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#006a63]">
            {t('eyebrow')}
          </p>

          <h1 className="font-serif text-[30px] font-medium leading-[38px] tracking-tight text-black">
            {t('title')}
          </h1>

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
                {t('emailLabel')}
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
                name="email"
                type="email"
                placeholder={t('emailPlaceholder')}
                className="w-full pl-10"
                disabled={isSubmitting || isSuccess}
              />
            </div>

            {error === 'emailRequired' || error === 'emailInvalid' ? (
              <p
                className="mt-1.5 text-xs font-medium text-[#ba1a1a]"
                role="alert"
              >
                {tValidation(error)}
              </p>
            ) : null}
          </TextField>

          {error === 'requestFailed' || error === 'tooManyRequests' ? (
            <p
              className="text-xs font-medium text-[#ba1a1a]"
              role="alert"
            >
              {t(`errors.${error}`)}
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
            disabled={isSubmitting || isSuccess}
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
  );
}
