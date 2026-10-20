import PrivateProfile from '@/app/[locale]/components/dashboard/private-profile';
import PublicProfile from '@/app/[locale]/components/dashboard/public-profile';
import { getProfileData } from './profile-utils';

interface ProfilePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  params: Promise<{ username: string }>;
}

export default async function ProfilePublishedPage({ params, searchParams }: ProfilePageProps) {
  const { username } = await params;
  const { currentUser, targetUsername, isOwnProfile } = await getProfileData(username);

  if (isOwnProfile && currentUser) {
    return <PrivateProfile currentUser={currentUser} searchParams={searchParams} currentTab="PUBLISHED" />;
  }

  return <PublicProfile targetUsername={targetUsername} searchParams={searchParams} currentTab="PUBLISHED" />;
}