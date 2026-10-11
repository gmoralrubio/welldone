import { CommentHeading } from '@/app/[locale]/components/comment/comment-heading';
import { CommentProps } from '@/lib/comment/comments.types';
import { Card, CardContent, CardHeader } from '@heroui/react';

export function CommentReply({ comment, articleAuthorId }: CommentProps) {
  return (
    <Card variant="tertiary">
      <CardHeader>
        <CommentHeading
          comment={comment}
          articleAuthorId={articleAuthorId}
        />
      </CardHeader>
      <CardContent>
        <p className="font-serif text-lg whitespace-pre-wrap">{comment.message}</p>
      </CardContent>
    </Card>
  );
}
