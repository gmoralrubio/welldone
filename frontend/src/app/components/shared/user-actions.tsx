import WriteButton from './write-button';
import UserProfile from './user-profile';

const UserActions = () => {
  return (
    <div className="flex items-center gap-4">
      <WriteButton />
      <UserProfile />
    </div>
  );
};

export default UserActions;
