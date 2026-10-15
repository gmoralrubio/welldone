'use client';

import { createCommentAction } from '@/app/[locale]/(site)/articles/actions';
import { UserAvatar } from '@/app/[locale]/components/user/user-avatar';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  TextArea,
} from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';
import { useActionState } from 'react';

export type CommentFormUser = {
  name: string;
  surname: string;
  username: string;
};

type CommentFormProps = {
  authorUsername: string;
  slug: string;
  user: CommentFormUser;
  parentId?: number;
  onCancel?: () => void;
};

const initialState = { error: null as string | null };

export function CommentForm({
  authorUsername,
  slug,
  user,
  parentId,
  onCancel,
}: CommentFormProps) {
  const t = useTranslations('ArticleDetailPage');
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(
    createCommentAction.bind(null, locale, authorUsername, slug),
    initialState
  );

  const errorMessage = state.error ? t('commentError') : null;

  return (
    <form action={formAction}>
      {parentId != null ? (
        <input
          type="hidden"
          name="parentId"
          value={parentId}
        />
      ) : null}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <UserAvatar
            name={user.name}
            surname={user.surname}
            username={user.username}
          />
          <span>
            {user.name} {user.surname}
          </span>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <TextArea
            fullWidth
            required
            name="message"
            placeholder={parentId != null ? t('writeReply') : t('replyPlaceholder')}
            variant="secondary"
            disabled={pending}
            aria-invalid={errorMessage ? true : undefined}
          />
          {errorMessage ? (
            <p
              role="alert"
              className="text-sm text-danger"
            >
              {errorMessage}
            </p>
          ) : null}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {onCancel ? (
            <Button
              type="button"
              variant="ghost"
              isDisabled={pending}
              onPress={onCancel}
            >
              {t('cancelReply')}
            </Button>
          ) : null}
          <Button
            type="submit"
            isDisabled={pending}
            className="bg-black text-white mt-2"
          >
            {t('publishReply')}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
