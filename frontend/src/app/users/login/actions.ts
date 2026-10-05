'use server';

import { cookies } from 'next/headers';

interface LoginUserData {
  identifier: string;
  password: string;
}

export async function loginUser(data: LoginUserData) {
  const response = await fetch(`${process.env.API_URL}/api/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (response.ok && responseData.accessToken) {
    const cookieStore = await cookies();
    cookieStore.set('accessToken', responseData.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  }

  return {
    status: response.status,
    data: responseData,
  };
}
