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

import { Prisma, ArticleStatus as PrismaArticleStatus } from "@prisma/client";

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
  categories: ArticleCategory[];
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
      ...(criteria.category
        ? { categories: { some: { slug: criteria.category } } }
        : {}),
      ...(criteria.search
        ? { title: { contains: criteria.search, mode: 'insensitive' as const } }
        : {}),
    };
    const [articlesPrisma, articlesCount] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { publishedAt: criteria.order },
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
              slug: true,
              name: true,
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
            slug: true,
            name: true,
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
          connect: params.categorySlugs.map((slug) => ({ slug })),
        },
      },
      include: {
        author: {
          select: { id: true, name: true, surname: true, username: true },
        },
        categories: { select: { id: true, slug: true, name: true } },
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

  async findMyArticles(authorId: number, skip: number, take: number, status?: ArticleStatus) {
    
    const whereClause: Prisma.ArticleWhereInput = { authorId };

    if (status) {
      whereClause.status = status as unknown as PrismaArticleStatus;
    }

    const [prismaArticles, total] = await this.prisma.$transaction([
      this.prisma.article.findMany({
        where: whereClause,
        include: { author: true, categories: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.article.count({ where: whereClause }),
    ]);

    const articles = prismaArticles.map((article: PrismaArticle) => this.restore(article));

    return { articles, total };
  }
  
}


