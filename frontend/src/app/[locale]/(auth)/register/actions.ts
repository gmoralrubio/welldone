'use server';

import { loginUser } from '../login/actions';

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

  if (response.status === 201) {
    const loginResponse = await loginUser({
      identifier: data.email,
      password: data.password,
    });

    if (loginResponse.status !== 200) {
      return {
        status: 500,
        data: {
          message: 'El usuario se ha registrado, pero no se ha podido iniciar sesión.',
        },
      };
    }
  }

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
