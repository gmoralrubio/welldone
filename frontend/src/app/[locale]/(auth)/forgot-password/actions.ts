'use server';

interface ForgotPasswordData {
  email: string;
  locale: 'es' | 'en';
}

export async function forgotPassword(data: ForgotPasswordData) {
  const response = await fetch(`${process.env.API_URL}/api/users/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    cache: 'no-store',
  });

  return {
    status: response.status,
  };
}
