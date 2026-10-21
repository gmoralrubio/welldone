import { cookies } from 'next/headers';
import { cache } from 'react';

interface CurrentUser {
  username: string;
}

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return null;
  }

  try {
    const response = await fetch(`${process.env.API_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as CurrentUser;
  } catch (error) {
    console.error('Error al comprobar la sesión:', error);
    return null;
  }
});
