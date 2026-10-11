'use client';

import { createCommentAction } from '@/app/[locale]/articles/actions';
import { formatAvatarLetter } from '@/lib/shared/format-avatar-letter';
import { Bold, Code, QuoteOpen } from '@gravity-ui/icons';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  TextArea,
} from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';
import { useActionState } from 'react';

type CommentFormUser = {
  name: string;
  surname: string;
};

type CommentFormProps = {
  authorUsername: string;
  slug: string;
  user: CommentFormUser;
};

const initialState = { error: null as string | null };

export function CommentForm({ authorUsername, slug, user }: CommentFormProps) {
  const t = useTranslations('ArticleDetailPage');
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(
    createCommentAction.bind(null, locale, authorUsername, slug),
    initialState
  );

  const errorMessage =
    state.error === 'generic' || state.error === 'unauthorized'
      ? t('commentError')
      : state.error;

  return (
    <form action={formAction}>
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Avatar
            size="md"
            variant="soft"
            color="accent"
          >
            <Avatar.Fallback>
              {formatAvatarLetter(user.name, user.surname)}
            </Avatar.Fallback>
          </Avatar>
          <span>
            {user.name} {user.surname}
          </span>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <TextArea
            fullWidth
            required
            name="message"
            placeholder={t('replyPlaceholder')}
            variant="secondary"
            disabled={pending}
            aria-invalid={errorMessage ? true : undefined}
          />
          {errorMessage ? <p className="text-sm text-danger">{errorMessage}</p> : null}
        </CardContent>
        <CardFooter>
          <div className="flex flex-row items-center gap-4">
            <Bold className="text-muted hover:text-black" />
            <QuoteOpen className="text-muted hover:text-black" />
            <Code className="text-muted hover:text-black" />
          </div>
          <Button
            type="submit"
            isDisabled={pending}
            className="bg-black text-white ml-auto mt-2"
          >
            {t('publishReply')}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
