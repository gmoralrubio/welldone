'use server';

interface ResetPasswordData {
  token: string;
  password: string;
}

export async function resetPassword(data: ResetPasswordData) {
  const response = await fetch(`${process.env.API_URL}/api/users/reset-password`, {
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
