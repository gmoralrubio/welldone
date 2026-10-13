'use client';

import { useState } from 'react';
import { CommentHeading } from '@/app/[locale]/components/comment/comment-heading';
import { CommentForm, CommentFormUser } from '@/app/[locale]/components/comment/comment-form';
import { CommentReply } from '@/app/[locale]/components/comment/comment-reply';
import { Link } from '@/i18n/navigation';
import { CommentProps } from '@/lib/comment/comments.types';
import { Button, Card, CardContent, CardFooter, CardHeader } from '@heroui/react';
import { useTranslations } from 'next-intl';

type CommentCardProps = CommentProps & {
  authorUsername: string;
  slug: string;
  currentUser: CommentFormUser | null;
};

export function CommentCard({
  comment,
  articleAuthorId,
  authorUsername,
  slug,
  currentUser,
}: CommentCardProps) {
  const t = useTranslations('ArticleDetailPage');
  const [replyOpen, setReplyOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CommentHeading
          comment={comment}
          articleAuthorId={articleAuthorId}
        />
      </CardHeader>
      <CardContent>
        <p className="font-serif text-lg whitespace-pre-wrap">{comment.message}</p>
      </CardContent>
      <CardFooter>
        {currentUser ? (
          <Button
            variant="ghost"
            size="sm"
            className="text-sm text-muted"
            onPress={() => setReplyOpen((open) => !open)}
          >
            {t('reply')}
          </Button>
        ) : (
          <Link
            href="/login"
            className="text-sm text-muted"
          >
            {t('reply')}
          </Link>
        )}
      </CardFooter>
      {replyOpen && currentUser ? (
        <div className="px-4 pb-4">
          <CommentForm
            authorUsername={authorUsername}
            slug={slug}
            user={currentUser}
            parentId={comment.id}
            onCancel={() => setReplyOpen(false)}
          />
        </div>
      ) : null}
      {comment.children.length > 0 ? (
        <div className="ml-auto w-15/16 space-y-4">
          {comment.children.map((reply) => (
            <CommentReply
              key={reply.id}
              comment={reply}
              articleAuthorId={articleAuthorId}
            />
          ))}
        </div>
      ) : null}
    </Card>
  );
}
