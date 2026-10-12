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
    revalidatePath('/[locale]/dashboard/settings', 'page');
  }

  return {
    status: response.status,
    data: responseData,
  };
}

export async function checkAccountAvailability(
  field: 'username' | 'email',
  value: string
): Promise<boolean> {
  const response = await fetch(
    `${process.env.API_URL}/api/users/availability?field=${field}&value=${encodeURIComponent(value)}`,
    { cache: 'no-store' }
  );

  if (!response.ok) {
    throw new Error('Could not check account availability');
  }

  const data: { available: boolean } = await response.json();

  return data.available;
}
