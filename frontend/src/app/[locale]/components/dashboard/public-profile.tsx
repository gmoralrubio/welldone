interface UserProfile {
  id: number;
  name: string;
  surname: string;
  username: string;
  email: string;
}

interface PublicProfileProps {
  targetUsername: string;
  currentUser: UserProfile | null;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  currentTab: string;
}

export default async function PublicProfile({ targetUsername, currentUser, searchParams, currentTab }: PublicProfileProps) {
  return (
    <div>
      <h1>Perfil público de @{targetUsername}</h1>
      <p>Estamos desarrollando esta vista.</p>
    </div>
  );
}