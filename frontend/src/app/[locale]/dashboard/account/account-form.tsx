'use client';

import { useState, type SubmitEvent } from 'react';
import { Input, Label, TextField } from '@heroui/react';
import { ArrowRight, Person, At, Envelope } from '@gravity-ui/icons';
import { useTranslations } from 'next-intl';
import { accountSchema, type AccountFormData } from './schema';
import { updateAccount } from './actions';

type AccountField = keyof AccountFormData;

type AccountErrors = Partial<Record<AccountField, string>>;

type FormError = 'emailInUse' | 'usernameInUse' | 'updateFailed' | 'sessionExpired';

interface AccountFormProps {
  user: AccountFormData;
}

export default function AccountForm({ user }: AccountFormProps) {
  const t = useTranslations('Account');
  const tValidation = useTranslations('Validation.Register');

  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<AccountFormData>(user);

  const [errors, setErrors] = useState<AccountErrors>({});
  const [formError, setFormError] = useState<FormError | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    setErrors({});
    setFormError(null);
    setSuccess(false);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setErrors({});
    setFormError(null);
    setIsEditing(false);
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const data: AccountFormData = {
      name: formData.get('name')?.toString() ?? '',
      surname: formData.get('surname')?.toString() ?? '',
      username: formData.get('username')?.toString() ?? '',
      email: formData.get('email')?.toString() ?? '',
    };

    const result = accountSchema.safeParse(data);

    setSuccess(false);
    setFormError(null);

    if (!result.success) {
      const validationErrors: AccountErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as AccountField;

        if (!validationErrors[field]) {
          validationErrors[field] = issue.message;
        }
      });

      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSaving(true);

    try {
      const response = await updateAccount(result.data);

      if (response.status === 200) {
        setCurrentUser(result.data);
        setSuccess(true);
        setIsEditing(false);
      } else if (response.status === 409) {
        if (response.data.field === 'email') {
          setFormError('emailInUse');
        } else if (response.data.field === 'username') {
          setFormError('usernameInUse');
        } else {
          setFormError('updateFailed');
        }
      } else if (response.status === 401) {
        setFormError('sessionExpired');
      } else {
        setFormError('updateFailed');
      }
    } catch {
      setFormError('updateFailed');
    } finally {
      setIsSaving(false);
    }
  };

  const fieldErrorMessage = (field: AccountField) => {
    const error = errors[field];

    if (!error) return null;

    return tValidation(
      error as
        | 'nameMin'
        | 'surnameRequired'
        | 'usernameMin'
        | 'usernamePattern'
        | 'emailRequired'
        | 'emailInvalid'
    );
  };

  // VISTA DE CONSULTA
  if (!isEditing) {
    return (
      <section className="w-full max-w-xl rounded-xl bg-white p-6 shadow-md sm:p-8">
        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#006a63]">
            {t('title')}
          </p>

          <div className="flex items-center gap-3">
            <Person
              className="h-7 w-7 shrink-0 text-black"
              aria-hidden="true"
            />

            <h2 className="font-serif text-[30px] font-medium leading-[38px] tracking-tight text-black">
              {t('personalInfo')}
            </h2>
          </div>

          <p className="mt-2 max-w-md text-[15px] leading-[22px] text-[#45464d]">
            {t('subtitle')}
          </p>
        </div>
        <dl className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="mb-1 text-[12px] font-semibold text-[#45464d]">
                {t('nameLabel')}
              </dt>

              <dd className="flex h-10 w-full items-center gap-3 rounded-lg border border-[#c6c6cd] bg-[#faf9f6] px-3 text-[15px] text-black">
                <Person
                  className="h-4 w-4 shrink-0 text-[#76777d]"
                  aria-hidden="true"
                />
                <span>{currentUser.name}</span>
              </dd>
            </div>

            <div>
              <dt className="mb-1 text-[12px] font-semibold text-[#45464d]">
                {t('surnameLabel')}
              </dt>

              <dd className="flex h-10 w-full items-center gap-3 rounded-lg border border-[#c6c6cd] bg-[#faf9f6] px-3 text-[15px] text-black">
                <Person
                  className="h-4 w-4 shrink-0 text-[#76777d]"
                  aria-hidden="true"
                />
                <span>{currentUser.surname}</span>
              </dd>
            </div>
          </div>

          <div>
            <dt className="mb-1 text-[12px] font-semibold text-[#45464d]">
              {t('usernameLabel')}
            </dt>

            <dd className="flex h-10 w-full items-center gap-3 rounded-lg border border-[#c6c6cd] bg-[#faf9f6] px-3 text-[15px] text-black">
              <At
                className="h-4 w-4 shrink-0 text-[#76777d]"
                aria-hidden="true"
              />
              <span>{currentUser.username}</span>
            </dd>
          </div>

          <div>
            <dt className="mb-1 text-[12px] font-semibold text-[#45464d]">
              {t('emailLabel')}
            </dt>

            <dd className="flex h-10 w-full items-center gap-3 rounded-lg border border-[#c6c6cd] bg-[#faf9f6] px-3 text-[15px] text-black">
              <Envelope
                className="h-4 w-4 shrink-0 text-[#76777d]"
                aria-hidden="true"
              />
              <span className="break-all">{currentUser.email}</span>
            </dd>
          </div>
        </dl>

        {success && (
          <p
            role="status"
            className="mt-6 text-sm font-medium text-[#006a63]"
          >
            {t('success')}
          </p>
        )}

        <button
          type="button"
          onClick={handleEdit}
          className="mt-7 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-black px-5 text-sm font-semibold text-white transition-colors hover:bg-[#006a63]"
        >
          {t('edit')}
          <ArrowRight
            className="h-4 w-4"
            aria-hidden="true"
          />
        </button>
      </section>
    );
  }

  // VISTA DE EDICIÓN
  return (
    <section className="w-full max-w-xl rounded-xl bg-white p-6 shadow-md sm:p-8">
      <div className="mb-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#006a63]">
          {t('title')}
        </p>

        <div className="flex items-center gap-3">
          <Person
            className="h-7 w-7 shrink-0 text-black"
            aria-hidden="true"
          />

          <h2 className="font-serif text-[30px] font-medium leading-[38px] tracking-tight text-black">
            {t('editTitle')}
          </h2>
        </div>

        <p className="mt-2 max-w-md text-[15px] leading-[22px] text-[#45464d]">
          {t('editSubtitle')}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            name="name"
            defaultValue={currentUser.name}
          >
            <Label
              isRequired
              className="mb-1 text-[12px] font-semibold text-[#45464d]"
            >
              {t('nameLabel')}
            </Label>

            <div className="relative">
              <Person
                className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#76777d]"
                aria-hidden="true"
              />
              <Input className="w-full pl-10" />
            </div>

            {errors.name && (
              <p className="mt-1.5 text-xs font-medium text-[#ba1a1a]">
                {fieldErrorMessage('name')}
              </p>
            )}
          </TextField>

          <TextField
            name="surname"
            defaultValue={currentUser.surname}
          >
            <Label
              isRequired
              className="mb-1 text-[12px] font-semibold text-[#45464d]"
            >
              {t('surnameLabel')}
            </Label>

            <div className="relative">
              <Person
                className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#76777d]"
                aria-hidden="true"
              />
              <Input className="w-full pl-10" />
            </div>

            {errors.surname && (
              <p className="mt-1.5 text-xs font-medium text-[#ba1a1a]">
                {fieldErrorMessage('surname')}
              </p>
            )}
          </TextField>
        </div>

        <TextField
          name="username"
          defaultValue={currentUser.username}
        >
          <Label
            isRequired
            className="mb-1 text-[12px] font-semibold text-[#45464d]"
          >
            {t('usernameLabel')}
          </Label>

          <div className="relative">
            <At
              className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#76777d]"
              aria-hidden="true"
            />
            <Input className="w-full pl-10" />
          </div>

          {errors.username && (
            <p className="mt-1.5 text-xs font-medium text-[#ba1a1a]">
              {fieldErrorMessage('username')}
            </p>
          )}
        </TextField>

        <TextField
          name="email"
          type="email"
          defaultValue={currentUser.email}
        >
          <Label
            isRequired
            className="mb-1 text-[12px] font-semibold text-[#45464d]"
          >
            {t('emailLabel')}
          </Label>

          <div className="relative">
            <Envelope
              className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#76777d]"
              aria-hidden="true"
            />
            <Input className="w-full pl-10" />
          </div>

          {errors.email && (
            <p className="mt-1.5 text-xs font-medium text-[#ba1a1a]">
              {fieldErrorMessage('email')}
            </p>
          )}
        </TextField>

        {formError && (
          <p
            role="alert"
            className="text-sm font-medium text-[#ba1a1a]"
          >
            {t(`errors.${formError}`)}
          </p>
        )}

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="flex h-11 flex-1 items-center justify-center rounded-lg border border-[#c6c6cd] px-5 text-sm font-semibold text-black transition-colors hover:bg-gray-100 disabled:opacity-50"
          >
            {t('cancel')}
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-black px-5 text-sm font-semibold text-white transition-colors hover:bg-[#006a63] disabled:opacity-50"
          >
            {isSaving ? t('saving') : t('save')}
            {!isSaving && (
              <ArrowRight
                className="h-4 w-4"
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
