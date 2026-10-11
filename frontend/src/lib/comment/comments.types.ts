type CommentAuthorDto = {
  id: number;
  name: string;
  surname: string;
  username: string;
};

export type CommentDto = {
  id: number;
  message: string;
  userId: number;
  articleId: number;
  parentId: number | null;
  createdAt: string;
  updatedAt: string;
  user: CommentAuthorDto;
  children: CommentDto[];
};

export type CommentProps = {
  comment: CommentDto;
  articleAuthorId: number;
};
