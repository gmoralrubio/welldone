import { Chip } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { CommentProps } from '@/lib/comment/comments.types';
import { useRelativeTime } from '@/app/[locale]/hooks/useRelativeTime';
import { UserAvatar } from '@/app/[locale]/components/user/user-avatar';

export function CommentHeading({ comment, articleAuthorId }: CommentProps) {
  const t = useTranslations('ArticleDetailPage');
  const relativeTime = useRelativeTime(comment.createdAt);
  const isAuthor = comment.user.id === articleAuthorId;

  return (
    <div className="flex flex-row gap-2">
      <UserAvatar
        name={comment.user.name}
        surname={comment.user.surname}
        username={comment.user.username}
      />
      <div className="flex flex-col">
        <div className="flex gap-2">
          <span className="text-sm font-semibold">
            {comment.user.name} {comment.user.surname}
          </span>
          {isAuthor ? (
            <Chip
              size="sm"
              color="success"
              variant="soft"
            >
              {t('author')}
            </Chip>
          ) : (
            <Chip size="sm">{t('member')}</Chip>
          )}
        </div>
        <div>
          <span className="text-xs leading-0">{relativeTime}</span>
        </div>
      </div>
    </div>
  );
}
