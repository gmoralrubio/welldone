import prismaClient from '@infrastructure/shared/prisma-client';
import { ArticleRepository } from '@domain/article/repositories/ArticleRepository';
import { Article, ArticleStatus } from '@domain/article/Article';

interface PrismaArticleAuthor {
  id: number;
  name: string;
  surname: string;
  username: string;
}

interface PrismaArticle {
  id: number;
  authorId: number;
  title: string;
  content: string;
  intro: string;
  slug: string;
  status: ArticleStatus;
  publishedAt: Date;
  featuredImageUrl: string | null;
  featuredVideoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  author: PrismaArticleAuthor;
}

export class PrismaArticleRepository implements ArticleRepository {
  private readonly prisma = prismaClient;
  async findPublishedByAuthorAndSlug(
    authorUsername: string,
    slug: string
  ): Promise<Article | null> {
    const prismaArticle = await this.prisma.article.findFirst({
      where: {
        status: 'PUBLISHED',
        author: { username: authorUsername },
        slug,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            surname: true,
            username: true,
          },
        },
      },
    });

    if (!prismaArticle) {
      return null;
    } else {
      return this.restore(prismaArticle);
    }
  }
  private restore(prismaArticle: PrismaArticle): Article {
    return new Article({
      id: prismaArticle.id,
      authorId: prismaArticle.authorId,
      title: prismaArticle.title,
      content: prismaArticle.content,
      intro: prismaArticle.intro,
      slug: prismaArticle.slug,
      status: prismaArticle.status,
      publishedAt: prismaArticle.publishedAt,
      featuredImageUrl: prismaArticle.featuredImageUrl,
      featuredVideoUrl: prismaArticle.featuredVideoUrl,
      createdAt: prismaArticle.createdAt,
      updatedAt: prismaArticle.updatedAt,
      author: {
        id: prismaArticle.author.id,
        name: prismaArticle.author.name,
        surname: prismaArticle.author.surname,
        username: prismaArticle.author.username,
      },
    });
  }
}
