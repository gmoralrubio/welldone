'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import type { AccountFormData } from './schema';

export async function updateAccount(data: AccountFormData) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return {
      status: 401,
      data: { error: 'User not authenticated' },
    };
  }

  const response = await fetch(`${process.env.API_URL}/api/users/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
    cache: 'no-store',
  });

  const responseData = await response.json();

  if (response.ok) {
    revalidatePath('/[locale]/dashboard/account', 'page');
  }

  return {
    status: response.status,
    data: responseData,
  };
}
