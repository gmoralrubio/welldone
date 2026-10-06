'use server';

interface RegisterUserData {
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
}

export async function registerUser(data: RegisterUserData) {
  const response = await fetch(`${process.env.API_URL}/api/users/register`, {
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

export async function checkAvailability(
  field: 'username' | 'email',
  value: string
): Promise<boolean> {
  const response = await fetch(
    `${process.env.API_URL}/api/users/availability?field=${field}&value=${encodeURIComponent(value)}`
  );

  if (!response.ok) return true;

  const data = await response.json();
  return data.available;
}
