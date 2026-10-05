'use server';

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

  return {
    status: response.status,
    data: responseData,
  };
}
