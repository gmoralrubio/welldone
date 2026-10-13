export type CreateCommentParams = {
  message: string;
  userId: number;
  articleId: number;
  parentId: number | null;
};
