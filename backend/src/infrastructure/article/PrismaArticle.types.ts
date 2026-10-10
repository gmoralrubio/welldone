export interface PrismaArticle {
  id: number;
  authorId: number;
  title: string;
  content: string;
  intro: string;
  slug: string;
  status: PrismaArticleStatus;
  publishedAt: Date;
  featuredImageUrl: string | null;
  featuredVideoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  author: PrismaArticleAuthor;
  categories: PrismaArticleCategory[];
  _count: PrismaArticleCommentCount;
}

interface PrismaArticleAuthor {
  id: number;
  name: string;
  surname: string;
  username: string;
}

interface PrismaArticleCategory {
  id: number;
  slug: string;
  name: string;
}

type PrismaArticleStatus = 'DRAFT' | 'PUBLISHED';

interface PrismaArticleCommentCount {
  comments: number;
}

export interface PrismaArticleInclude {
  author: {
    select: {
      id: true;
      name: true;
      surname: true;
      username: true;
    };
  };
  categories: {
    select: {
      id: true;
      slug: true;
      name: true;
    };
  };
  _count: {
    select: {
      comments: true;
    };
  };
}
