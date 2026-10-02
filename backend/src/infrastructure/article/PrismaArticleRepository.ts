import prismaClient from '@infrastructure/shared/prisma-client';
import {
  ArticleRepository,
  CreateArticleParams,
} from '@domain/article/repositories/ArticleRepository';
import {
  Article,
  ArticleStatus,
  ArticleCategory,
} from '@domain/article/Article';

import { FindArticlesResponse } from '@domain/article/types/FindArticlesResponse';
import { FindPublishedArticlesUseCaseInput } from '@domain/article/use-cases/find-published-articles';

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
  categories?: ArticleCategory[];
}

export class PrismaArticleRepository implements ArticleRepository {
  private readonly prisma = prismaClient;

  async findPublishedArticles(
    criteria: FindPublishedArticlesUseCaseInput
  ): Promise<FindArticlesResponse> {
    const { page, limit } = criteria;
    const now = new Date();
    const where = {
      status: 'PUBLISHED' as const,
      publishedAt: { lt: now },
      ...(criteria.authorId ? { authorId: criteria.authorId } : {}),
      ...(criteria.search
        ? { title: { contains: criteria.search, mode: 'insensitive' as const } }
        : {}),
    };
    const [articlesPrisma, articlesCount] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
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
      }),
      this.prisma.article.count({ where }),
    ]);
    const articles = articlesPrisma.map((article) => this.restore(article));
    return {
      articles,
      total: articlesCount,
    };
  }
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
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
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

  async create(params: CreateArticleParams): Promise<Article> {
    const prismaArticle = await this.prisma.article.create({
      data: {
        title: params.title,
        content: params.content,
        intro: params.intro,
        slug: params.slug,
        status: params.status,
        publishedAt: params.publishedAt,
        featuredImageUrl: params.featuredImageUrl,
        featuredVideoUrl: params.featuredVideoUrl,
        authorId: params.authorId,
        categories: {
          connect: params.categoryIds.map((id) => ({ id })),
        },
      },
      include: {
        author: {
          select: { id: true, name: true, surname: true, username: true },
        },
        categories: { select: { id: true, name: true, slug: true } },
      },
    });

    return this.restore(prismaArticle);
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
      featuredImageUrl: prismaArticle.featuredImageUrl ?? '',
      featuredVideoUrl: prismaArticle.featuredVideoUrl ?? '',
      createdAt: prismaArticle.createdAt,
      updatedAt: prismaArticle.updatedAt,
      author: {
        id: prismaArticle.author.id,
        name: prismaArticle.author.name,
        surname: prismaArticle.author.surname,
        username: prismaArticle.author.username,
      },
      categories: prismaArticle.categories || [],
    });
  }
}
