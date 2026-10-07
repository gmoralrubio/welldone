'use server';

import { cookies } from 'next/headers';
import { redirect } from '@/i18n/navigation';
import { resolveLocale } from '@/i18n/locale-utils';

export async function logout(locale: string) {
  const cookieStore = await cookies();

  cookieStore.delete('accessToken');

  redirect({ href: '/articles', locale: resolveLocale(locale) });
}
