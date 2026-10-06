'use server';

import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.delete('accessToken');

  const locale = await getLocale();
  redirect({ href: '/articles', locale });
}
