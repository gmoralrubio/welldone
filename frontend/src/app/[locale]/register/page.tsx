'use client';

import { useState, type SubmitEvent, type FocusEvent } from 'react';
import { registerSchema, type RegisterFormData } from './schema';
import {
  ArrowLeft,
  ArrowRight,
  Person,
  PersonPlus,
  Lock,
  At,
  Envelope,
} from '@gravity-ui/icons';
import { Input, Label, TextField } from '@heroui/react';
import { registerUser, checkAvailability } from './actions';
import { Link, useRouter } from '@/i18n/navigation';
import LocaleSwitcher from '@/app/[locale]/components/shared/locale-switcher';
import { useTranslations } from 'next-intl';

type RegisterFieldKey = keyof RegisterFormData;
type RegisterValidationKey =
  | 'nameMin'
  | 'surnameRequired'
  | 'usernameMin'
  | 'usernamePattern'
  | 'emailRequired'
  | 'emailInvalid'
  | 'passwordRequired'
  | 'passwordPattern'
  | 'repeatPasswordRequired'
  | 'passwordsMismatch';
type RegisterConflictKey = 'emailTaken' | 'usernameTaken';

type RegisterErrors = Partial<
  Record<RegisterFieldKey, RegisterValidationKey | RegisterConflictKey>
>;

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations('AuthRegister');
  const tValidation = useTranslations('Validation.Register');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [errors, setErrors] = useState<RegisterErrors>({});

  const fieldErrorMessage = (field: RegisterFieldKey, key?: string) => {
    if (!key) return null;
    if (key === 'emailTaken' || key === 'usernameTaken') {
      return t(`errors.${key}`);
    }
    return tValidation(key as RegisterValidationKey);
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const data: RegisterFormData = {
      name: formData.get('name')?.toString() ?? '',
      surname: formData.get('surname')?.toString() ?? '',
      username: formData.get('username')?.toString() ?? '',
      email: formData.get('email')?.toString() ?? '',
      password: formData.get('password')?.toString() ?? '',
      repeatPassword: formData.get('repeatPassword')?.toString() ?? '',
    };

    const result = registerSchema.safeParse(data);

    if (!result.success) {
      const validationErrors: RegisterErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as RegisterFieldKey;

        if (!validationErrors[field]) {
          validationErrors[field] = issue.message as RegisterValidationKey;
        }
      });

      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const response = await registerUser({
      name: result.data.name,
      surname: result.data.surname,
      username: result.data.username,
      email: result.data.email,
      password: result.data.password,
    });

    if (response.status === 201) {
      router.replace('/');
      router.refresh();
      return;
    }

    if (response.status === 409) {
      const field = response.data.field as 'email' | 'username';

      setErrors({
        [field]: field === 'email' ? 'emailTaken' : 'usernameTaken',
      });

      return;
    }

    console.error('Error al registrar usuario');
  };

  const handleOnBlur = async (event: FocusEvent<HTMLInputElement>) => {
    const field = event.target.name as RegisterFieldKey;
    const value = event.target.value.trim();

    if (!value) {
      return;
    }

    const fieldSchema = registerSchema.shape[field];

    if (!fieldSchema) {
      return;
    }

    const result = fieldSchema.safeParse(value);

    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        [field]: result.error.issues[0].message as RegisterValidationKey,
      }));
      return;
    }

    if (field === 'username' || field === 'email') {
      const available = await checkAvailability(field, value);

      setErrors((prev) => ({
        ...prev,
        [field]: available
          ? undefined
          : field === 'email'
            ? 'emailTaken'
            : 'usernameTaken',
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
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
              <PersonPlus
                className="h-7 w-7 shrink-0 text-black"
                aria-hidden="true"
              />

              <h1 className="font-serif text-[30px] font-medium tracking-tight text-black">
                {t('title')}
              </h1>
            </div>

            <p className="mt-2 max-w-md text-[15px]  text-[#45464d]">{t('subtitle')}</p>
          </div>

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField>
                <Label
                  isRequired
                  className="mb-1 text-xs font-semibold text-[#45464d]"
                >
                  {t('nameLabel')}
                </Label>

                <div className="relative">
                  <Person
                    className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#76777d]"
                    aria-hidden="true"
                  />

                  <Input
                    name="name"
                    placeholder={t('namePlaceholder')}
                    className="w-full pl-10"
                    onBlur={handleOnBlur}
                  />
                </div>
                {errors.name ? (
                  <p className="mt-1.5 text-xs font-medium text-[#ba1a1a]">
                    {fieldErrorMessage('name', errors.name)}
                  </p>
                ) : null}
              </TextField>

              <TextField>
                <Label
                  isRequired
                  className="mb-1 text-xs font-semibold text-[#45464d]"
                >
                  {t('surnameLabel')}
                </Label>

                <div className="relative">
                  <Person
                    className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#76777d]"
                    aria-hidden="true"
                  />

                  <Input
                    name="surname"
                    placeholder={t('surnamePlaceholder')}
                    className="w-full pl-10"
                    onBlur={handleOnBlur}
                  />
                </div>
                {errors.surname ? (
                  <p className="mt-1.5 text-xs font-medium text-[#ba1a1a]">
                    {fieldErrorMessage('surname', errors.surname)}
                  </p>
                ) : null}
              </TextField>
            </div>

            <TextField>
              <div className="mb-1 flex items-center justify-between">
                <Label
                  isRequired
                  className="text-xs font-semibold text-[#45464d]"
                >
                  {t('usernameLabel')}
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
                  name="username"
                  placeholder={t('usernamePlaceholder')}
                  className="w-full pl-10"
                  onBlur={handleOnBlur}
                />
              </div>
              {errors.username ? (
                <p className="mt-1.5 text-xs font-medium text-[#ba1a1a]">
                  {fieldErrorMessage('username', errors.username)}
                </p>
              ) : null}
            </TextField>

            <TextField>
              <div className="mb-1 flex items-center justify-between">
                <Label
                  isRequired
                  className="text-xs font-semibold text-[#45464d]"
                >
                  {t('emailLabel')}
                </Label>

                <span className="text-[11px] font-medium text-[#76777d]">
                  {t('required')}
                </span>
              </div>

              <div className="relative">
                <Envelope
                  className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#76777d]"
                  aria-hidden="true"
                />
                <Input
                  name="email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  className="w-full pl-10"
                  onBlur={handleOnBlur}
                />
              </div>
              {errors.email ? (
                <p className="mt-1.5 text-xs font-medium text-[#ba1a1a]">
                  {fieldErrorMessage('email', errors.email)}
                </p>
              ) : null}
            </TextField>

            <TextField>
              <div className="mb-1 flex items-center justify-between">
                <Label
                  isRequired
                  className="text-xs font-semibold text-[#45464d]"
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
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full pl-10"
                  onBlur={handleOnBlur}
                />
              </div>
              {errors.password ? (
                <p className="mt-1.5 text-xs font-medium text-[#ba1a1a]">
                  {fieldErrorMessage('password', errors.password)}
                </p>
              ) : null}
            </TextField>

            <TextField>
              <div className="mb-1 flex items-center justify-between">
                <Label
                  isRequired
                  className="text-xs font-semibold text-[#45464d]"
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
                  value={repeatPassword}
                  onChange={(event) => setRepeatPassword(event.target.value)}
                  className="w-full pl-10"
                />
              </div>
              {errors.repeatPassword ? (
                <p className="mt-1.5 text-xs font-medium text-[#ba1a1a]">
                  {fieldErrorMessage('repeatPassword', errors.repeatPassword)}
                </p>
              ) : null}
            </TextField>

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
              <p className="text-[#45464d]">{t('hasAccount')}</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 font-semibold text-black transition-colors hover:text-[#006a63]"
              >
                {t('signIn')}
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
