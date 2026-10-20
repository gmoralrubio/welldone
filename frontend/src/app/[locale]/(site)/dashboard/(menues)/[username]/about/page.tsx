import PrivateProfile from '@/app/[locale]/components/dashboard/private-profile';
import PublicProfile from '@/app/[locale]/components/dashboard/public-profile';
import { getProfileData } from '../profile-utils';

interface AboutPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  params: Promise<{ username: string }>;
}

export default async function ProfileAboutPage({ params, searchParams }: AboutPageProps) {
  const { username } = await params;
  const { currentUser, targetUsername, isOwnProfile } = await getProfileData(username);

  if (isOwnProfile && currentUser) {
    return <PrivateProfile currentUser={currentUser} searchParams={searchParams} currentTab="ABOUT" />;
  }

  return <PublicProfile targetUsername={targetUsername} searchParams={searchParams} currentTab="ABOUT" />;
}