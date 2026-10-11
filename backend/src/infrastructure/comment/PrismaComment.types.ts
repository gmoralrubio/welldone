export interface PrismaComment {
  id: number;
  message: string;
  userId: number;
  user: PrismaCommentUser;
  articleId: number;
  parentId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

interface PrismaCommentUser {
  id: number;
  username: string;
  name: string;
  surname: string;
}
