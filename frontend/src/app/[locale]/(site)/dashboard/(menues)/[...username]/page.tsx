import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';
import PrivateProfile from '@/app/[locale]/components/dashboard/private-profile';
import PublicProfile from '@/app/[locale]/components/dashboard/public-profile';

interface ProfilePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  params: Promise<{ username: string[] }>;
}


export default async function ProfileDynamicPage({ params, searchParams }: ProfilePageProps) {
  const { username: usernameParams } = await params;

  const rawUsername = usernameParams[0];

  const currentTab = usernameParams[1]?.toUpperCase() || 'PUBLISHED';

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  
  let currentUser= null;

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
      console.error('Error fetching current user:');
    }
  }


  const decodedUsername = decodeURIComponent(rawUsername);
  const targetUsername = decodedUsername.startsWith('@') 
    ? decodedUsername.substring(1) 
    : decodedUsername;

  const isOwnProfile = currentUser?.username === targetUsername;

  if (isOwnProfile && currentUser) {
    return <PrivateProfile currentUser={currentUser} searchParams={searchParams} currentTab={currentTab}/>;
  } else {
    return <PublicProfile targetUsername={targetUsername} searchParams={searchParams} currentTab={currentTab} />;
  }
}