import { Link } from '@heroui/react';
import WriteButton from './write-button';
import UserProfile from './user-profile';

type UserActionsProps = {
  isAuthenticated: boolean;
};
const UserActions = ({ isAuthenticated }: UserActionsProps) => {
  if (!isAuthenticated) {
    return (
      <Link
        href="/users/login"
        className="inline-flex items-center gap-1 text-sm font-semibold text-accent-dark no-underline"
      >
        Iniciar sesión <span aria-hidden="true">→</span>
      </Link>
    );
  }
  return (
    <div className="flex items-center gap-4">
      <WriteButton />
      <UserProfile />
    </div>
  );
};

export default UserActions;
