import PrivateProfile from '@/app/[locale]/components/dashboard/private-profile';
import { getProfileData } from '../profile-utils';
import { notFound } from 'next/navigation';

interface DraftPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  params: Promise<{ username: string }>;
}

export default async function ProfileDraftPage({ params, searchParams }: DraftPageProps) {
  const { username } = await params;
  const { currentUser, isOwnProfile } = await getProfileData(username);

  if (!isOwnProfile || !currentUser) {
    notFound();
  }

  return <PrivateProfile currentUser={currentUser} searchParams={searchParams} currentTab="DRAFT" />;
}