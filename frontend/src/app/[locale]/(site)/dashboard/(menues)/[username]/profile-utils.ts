import { cookies } from 'next/headers';

export async function getProfileData(rawUsername: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  
  let currentUser = null;

  if (accessToken) {
    try {
      const response = await fetch(`${process.env.API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
      });
      if (response.ok) {
        currentUser = await response.json();
      }
    } catch {
      console.error('Error fetching current user');
    }
  }

  const decodedUsername = decodeURIComponent(rawUsername);
  const targetUsername = decodedUsername.startsWith('@') 
    ? decodedUsername.substring(1) 
    : decodedUsername;

  const isOwnProfile = currentUser?.username === targetUsername;

  return { currentUser, targetUsername, isOwnProfile };
}