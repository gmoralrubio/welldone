'use client';

import { CommentHeading } from '@/app/[locale]/components/comment/comment-heading';
import { CommentReply } from '@/app/[locale]/components/comment/comment-reply';
import { CommentProps } from '@/lib/comment/comments.types';
import { Card, CardContent, CardFooter, CardHeader } from '@heroui/react';
import { useTranslations } from 'next-intl';

export function CommentCard({ comment, articleAuthorId }: CommentProps) {
  const t = useTranslations('ArticleDetailPage');

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
        <span className="text-sm text-muted">{t('reply')}</span>
      </CardFooter>
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
