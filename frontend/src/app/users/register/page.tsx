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
import Link from 'next/link';
import { registerUser, checkAvailability } from './actions';

export default function RegisterPage() {
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>(
    {}
  );
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
      const validationErrors: Partial<Record<keyof RegisterFormData, string>> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof RegisterFormData;

        if (!validationErrors[field]) {
          validationErrors[field] = issue.message;
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
      console.log('Usuario registrado correctamente');

      return;
    }

    if (response.status === 409) {
      const field = response.data.field as 'email' | 'username';

      setErrors({
        [field]:
          field === 'email'
            ? 'Este correo electrónico ya está registrado'
            : 'Este nombre de usuario ya está en uso',
      });

      return;
    }

    console.error('Error al registrar usuario');
  };

  const handleOnBlur = async (event: FocusEvent<HTMLInputElement>) => {
    const field = event.target.name as keyof RegisterFormData;
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
        [field]: result.error.issues[0].message,
      }));
      return;
    }

    if (field === 'username' || field === 'email') {
      const available = await checkAvailability(field, value);

      const messages = {
        username: 'Este nombre de usuario ya está en uso',
        email: 'Este correo electrónico ya está registrado',
      };

      setErrors((prev) => ({
        ...prev,
        [field]: available ? undefined : messages[field],
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };
  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#1a1c1a] antialiased">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="text-xl font-semibold tracking-tight text-black">WellDone</div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="hidden items-center gap-2 text-sm font-medium text-[#45464d] transition-colors hover:text-black sm:flex"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la lectura pública
          </Link>

          <div className="flex items-center gap-2 rounded-full bg-[#f4f3f1] px-3 py-1.5 text-xs font-semibold shadow-sm">
            <span className="text-black">ES</span>
            <span className="text-[#76777d]">/</span>
            <span className="text-[#76777d]">EN</span>
            <span className="text-[#76777d]">/</span>
            <span className="text-[#76777d]">FR</span>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <section className="mx-auto flex w-full max-w-7xl justify-center px-4 pb-5 pt-1 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-md sm:p-8">
          {/* Cabecera */}
          <div className="mb-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#006a63]">
              Únete a WellDone
            </p>

            <div className="flex items-center gap-3">
              <PersonPlus
                className="h-7 w-7 shrink-0 text-black"
                aria-hidden="true"
              />

              <h1 className="font-serif text-[30px] font-medium leading-[38px] tracking-tight text-black">
                Crear cuenta
              </h1>
            </div>

            <p className="mt-2 max-w-md text-[15px] leading-[22px] text-[#45464d]">
              Crea tu cuenta para participar en la comunidad de WellDone.
            </p>
          </div>

          {/* Formulario */}
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Nombre y apellidos */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField>
                <Label
                  isRequired
                  className="mb-1 text-[12px] font-semibold text-[#45464d]"
                >
                  Nombre
                </Label>

                <div className="relative">
                  <Person
                    className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#76777d]"
                    aria-hidden="true"
                  />

                  <Input
                    name="name"
                    placeholder="Tu nombre"
                    className="w-full pl-10"
                    onBlur={handleOnBlur}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-xs font-medium text-[#ba1a1a]">
                    {errors.name}
                  </p>
                )}
              </TextField>

              <TextField>
                <Label
                  isRequired
                  className="mb-1 text-[12px] font-semibold text-[#45464d]"
                >
                  Apellidos
                </Label>

                <div className="relative">
                  <Person
                    className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#76777d]"
                    aria-hidden="true"
                  />

                  <Input
                    name="surname"
                    placeholder="Tus apellidos"
                    className="w-full pl-10"
                    onBlur={handleOnBlur}
                  />
                </div>
                {errors.surname && (
                  <p className="mt-1.5 text-xs font-medium text-[#ba1a1a]">
                    {errors.surname}
                  </p>
                )}
              </TextField>
            </div>

            {/* Username */}
            <TextField>
              <div className="mb-1 flex items-center justify-between">
                <Label
                  isRequired
                  className="text-[12px] font-semibold text-[#45464d]"
                >
                  Nombre de usuario
                </Label>

                <span className="text-[11px] font-medium text-[#76777d]">
                  Obligatorio
                </span>
              </div>

              <div className="relative">
                <At
                  className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#76777d]"
                  aria-hidden="true"
                />

                <Input
                  name="username"
                  placeholder="tu_usuario"
                  className="w-full pl-10"
                  onBlur={handleOnBlur}
                />
              </div>
              {errors.username && (
                <p className="mt-1.5 text-xs font-medium text-[#ba1a1a]">
                  {errors.username}
                </p>
              )}
            </TextField>

            {/* Email */}
            <TextField>
              <div className="mb-1 flex items-center justify-between">
                <Label
                  isRequired
                  className="text-[12px] font-semibold text-[#45464d]"
                >
                  Correo electrónico
                </Label>

                <span className="text-[11px] font-medium text-[#76777d]">
                  Obligatorio
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
                  placeholder="tu@email.com"
                  className="w-full pl-10"
                  onBlur={handleOnBlur}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs font-medium text-[#ba1a1a]">
                  {errors.email}
                </p>
              )}
            </TextField>

            {/* Contraseña */}
            <TextField>
              <div className="mb-1 flex items-center justify-between">
                <Label
                  isRequired
                  className="text-[12px] font-semibold text-[#45464d]"
                >
                  Contraseña
                </Label>

                <span className="text-[11px] font-medium text-[#76777d]">
                  Obligatorio
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
                  placeholder="Introduce tu contraseña"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full pl-10"
                  onBlur={handleOnBlur}
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs font-medium text-[#ba1a1a]">
                  {errors.password}
                </p>
              )}
            </TextField>

            {/* Repetir contraseña */}
            <TextField>
              <div className="mb-1 flex items-center justify-between">
                <Label
                  isRequired
                  className="text-[12px] font-semibold text-[#45464d]"
                >
                  Repetir contraseña
                </Label>
                <span className="text-[11px] font-medium text-[#76777d]">
                  Obligatorio
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
                  placeholder="Repite tu contraseña"
                  value={repeatPassword}
                  onChange={(event) => setRepeatPassword(event.target.value)}
                  className="w-full pl-10"
                />
              </div>
              {errors.repeatPassword && (
                <p className="mt-1.5 text-xs font-medium text-[#ba1a1a]">
                  {errors.repeatPassword}
                </p>
              )}
            </TextField>

            {/* Botón */}
            <button
              type="submit"
              className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-black px-5 text-sm font-semibold text-white transition-colors hover:bg-[#006a63]"
            >
              Crear cuenta
              <ArrowRight
                className="h-4 w-4"
                aria-hidden="true"
              />
            </button>
          </form>

          {/* Login */}
          <div className="mt-6 border-t border-[#c6c6cd] pt-5">
            <div className="flex items-center justify-center gap-2 text-sm">
              <p className="text-[#45464d]">¿Ya tienes una cuenta?</p>
              <Link
                href="/users/login"
                className="inline-flex items-center gap-1.5 font-semibold text-black transition-colors hover:text-[#006a63]"
              >
                Iniciar sesión
                <ArrowRight
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 pb-8 pt-2 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-bold tracking-[0.06em] text-[#76777d] sm:justify-start">
          <span>© 2025 WELLDONE PRESS</span>
          <span className="text-[#c6c6cd]">•</span>
          <span>TODOS LOS DERECHOS RESERVADOS</span>
          <span className="text-[#c6c6cd]">•</span>
          <span>ISSN 2984-118X</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-bold tracking-[0.06em] text-[#76777d]">
          <span>KEEPCODING BOOTCAMP PROYECTO FINAL</span>
          <a
            href="#"
            className="transition-colors hover:text-[#000000]"
          >
            Términos Editoriales
          </a>
          <a
            href="#"
            className="transition-colors hover:text-[#000000]"
          >
            Privacidad
          </a>
        </div>
      </footer>
    </main>
  );
}
