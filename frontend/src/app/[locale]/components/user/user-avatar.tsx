import { Avatar } from '@heroui/react';
import { Link } from '@/i18n/navigation';
import { authorArticlesHref } from '@/lib/article/article-presenters';
import { formatAvatarLetter } from '@/lib/shared/format-avatar-letter';

type UserAvatarProps = {
  name: string;
  surname: string;
  username: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fallbackClassName?: string;
};

export function UserAvatar({
  name,
  surname,
  username,
  size = 'md',
  className,
  fallbackClassName,
}: UserAvatarProps) {
  return (
    <Link
      href={authorArticlesHref(username)}
      className="no-underline"
    >
      <Avatar
        size={size}
        variant="soft"
        color="accent"
        className={className}
      >
        <Avatar.Fallback className={fallbackClassName}>
          {formatAvatarLetter(name, surname)}
        </Avatar.Fallback>
      </Avatar>
    </Link>
  );
}
