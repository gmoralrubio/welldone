import prismaClient from '@infrastructure/shared/prisma-client';
import { ArticleRepository } from '@domain/article/repositories/ArticleRepository';
import { Article } from '@domain/article/Article';
import { FindArticlesResponse } from '@domain/article/types/FindArticlesResponse';
import { FindPublishedArticlesUseCaseInput } from '@domain/article/use-cases/find-published-articles';
import { FindMyArticlesUseCaseInput } from '@domain/article/use-cases/find-my-articles';
import { FindMyArticleUseCaseInput } from '@domain/article/use-cases/find-my-article';
import {
  PrismaArticle,
  PrismaArticleInclude,
} from '@infrastructure/article/PrismaArticle.types';
import { CreateArticleUseCaseInput } from '@domain/article/use-cases/create-article';
import { FindArticleDetailUseCaseInput } from '@domain/article/use-cases/find-article-detail';
import { UpdateArticleUseCaseInput } from '@domain/article/use-cases/update-article';

const articleInclude = {
  author: {
    select: { id: true, name: true, surname: true, username: true },
  },
  categories: {
    select: { id: true, slug: true, name: true },
  },
  _count: {
    select: { comments: true },
  },
} satisfies PrismaArticleInclude;

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
      ...(criteria.category ? { categories: { some: { slug: criteria.category } } } : {}),
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
        include: articleInclude,
      }),
      this.prisma.article.count({ where }),
    ]);
    const articles = articlesPrisma.map((article) => this.restore(article));
    return {
      articles,
      total: articlesCount,
    };
  }

  async findMyArticles(
    criteria: FindMyArticlesUseCaseInput
  ): Promise<FindArticlesResponse> {
    const { page, limit } = criteria;
    const status = criteria.status as string | undefined; 
    const now = new Date();

    const where = {
      authorId: criteria.authorId,
      ...(status === 'SCHEDULED'
        ? { status: 'PUBLISHED' as const, publishedAt: { gt: now } }
        : status === 'PUBLISHED'
        ? { status: 'PUBLISHED' as const, publishedAt: { lte: now } }
        : status === 'DRAFT'
        ? { status: 'DRAFT' as const }
        : {}),
      ...(criteria.category ? { categories: { some: { slug: criteria.category } } } : {}),
      ...(criteria.search
        ? { title: { contains: criteria.search, mode: 'insensitive' as const } }
        : {}),
    };

    const [articlesPrisma, articlesCount] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: articleInclude,
      }),
      this.prisma.article.count({ where }),
    ]);
    const articles = articlesPrisma.map((article) => this.restore(article));
    return {
      articles,
      total: articlesCount,
    };
  }
  async findPublishedArticleByAuthorAndSlug(
    criteria: FindArticleDetailUseCaseInput
  ): Promise<Article | null> {
    const { authorUsername, slug } = criteria;
    const articlesPrisma = await this.prisma.article.findFirst({
      where: {
        author: { username: authorUsername },
        slug,
      },
      include: articleInclude,
    });

    if (!articlesPrisma) {
      return null;
    } else {
      return this.restore(articlesPrisma);
    }
  }

  async findArticleByIdAndSlug(criteria: FindMyArticleUseCaseInput): Promise<Article | null> {
    const articlesPrisma = await this.prisma.article.findFirst({
      where: {
        authorId: criteria.authorId,
        slug: criteria.slug,
      },
      include: articleInclude,
    });

    if (!articlesPrisma) {
      return null;
    }

    return this.restore(articlesPrisma);
  }

  async create(criteria: CreateArticleUseCaseInput): Promise<Article> {
    const prismaArticle = await this.prisma.article.create({
      data: {
        title: criteria.title,
        content: criteria.content,
        intro: criteria.intro,
        slug: criteria.slug,
        status: criteria.status,
        publishedAt: criteria.publishedAt,
        featuredImageUrl: criteria.featuredImageUrl,
        featuredVideoUrl: criteria.featuredVideoUrl,
        authorId: criteria.authorId,
        categories: {
          connect: criteria.categorySlugs.map((slug) => ({ slug })),
        },
      },
      include: articleInclude,
    });

    return this.restore(prismaArticle);
  }

  async findById(id: number): Promise<Article | null> {
    const articlePrisma = await this.prisma.article.findUnique({
      where: { id },
      include: articleInclude,
    });

    if (!articlePrisma) {
      return null;
    }

    return this.restore(articlePrisma);
  }

  async findByTitleAndAuthor(title: string, authorId: number): Promise<Article | null> {
    const articlePrisma = await this.prisma.article.findFirst({
      where: {
        title,
        authorId,
      },
      include: articleInclude,
    });

    if (!articlePrisma) {
      return null;
    }

    return this.restore(articlePrisma);
  }

  async update(id: number, criteria: UpdateArticleUseCaseInput): Promise<Article> {
    const prismaArticle = await this.prisma.article.update({
      where: { id },
      data: {
        title: criteria.title,
        content: criteria.content,
        intro: criteria.intro,
        status: criteria.status,
        // Si mandan null (borraron la fecha), ponemos "ahora". Si mandan fecha, la usamos. Si no mandan nada, no la tocamos.
        publishedAt: criteria.publishedAt === null ? new Date() : criteria.publishedAt !== undefined ? criteria.publishedAt : undefined,
        featuredImageUrl: criteria.featuredImageUrl,
        featuredVideoUrl: criteria.featuredVideoUrl,
        ...(criteria.categorySlugs && {
          categories: {
            set: criteria.categorySlugs.map((slug) => ({ slug })),
          },
        }),
      },
      include: articleInclude,
    });

    return this.restore(prismaArticle);
  }
  
  async delete(id: number): Promise<void> {
    await this.prisma.article.delete({
      where: { id },
    });
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
      commentCount: prismaArticle._count.comments,
    });
  }
  
}


