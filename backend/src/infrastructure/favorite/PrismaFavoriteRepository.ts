import { Article } from '@domain/article/Article';
import { FindFavoritesParams } from '@domain/favorite/types/FindFavoriteParams';
import { FindFavoritesResponse } from '@domain/favorite/types/FindFavoriteResponse';
import { FavoriteRepository } from '@domain/favorite/repositories/FavoriteRepository';
import { Favorite } from '@domain/favorite/Favorite';
import { SaveFavoriteResult } from '@domain/favorite/types/SaveFavoriteResult';
import { SaveFavoritesParams } from '@domain/favorite/types/SaveFavoritesParams';
import { PrismaArticle } from '@infrastructure/article/PrismaArticle.types';
import { PrismaFavorite } from '@infrastructure/favorite/PrismaFavorite.types';
import prismaClient from '@infrastructure/shared/prisma-client';

const favoriteArticleInclude = {
  author: {
    select: { id: true, name: true, surname: true, username: true },
  },
  categories: {
    select: { id: true, slug: true, name: true },
  },
  _count: {
    select: { comments: true },
  },
} as const;

export class PrismaFavoriteRepository implements FavoriteRepository {
  private readonly prisma = prismaClient;

  async save(params: SaveFavoritesParams): Promise<SaveFavoriteResult> {
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_articleId: {
          userId: params.userId,
          articleId: params.articleId,
        },
      },
    });

    if (existing) {
      return { favorite: this.restore(existing), created: false };
    }

    const prismaFavorite = await this.prisma.favorite.create({
      data: {
        userId: params.userId,
        articleId: params.articleId,
      },
    });
    return { favorite: this.restore(prismaFavorite), created: true };
  }

  async findMany(params: FindFavoritesParams): Promise<FindFavoritesResponse> {
    const { page, limit, userId } = params;
    const now = new Date();
    const where = {
      userId,
      article: {
        status: 'PUBLISHED' as const,
        publishedAt: { lte: now },
      },
    };

    const [rows, total] = await Promise.all([
      this.prisma.favorite.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          article: {
            include: favoriteArticleInclude,
          },
        },
      }),
      this.prisma.favorite.count({ where }),
    ]);

    return {
      articles: rows.map((row) => this.restoreArticle(row.article)),
      total,
    };
  }

  private restoreArticle(prismaArticle: PrismaArticle): Article {
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

  private restore(prismaFavorite: PrismaFavorite): Favorite {
    return new Favorite({
      id: prismaFavorite.id,
      userId: prismaFavorite.userId,
      articleId: prismaFavorite.articleId,
      createdAt: prismaFavorite.createdAt,
      updatedAt: prismaFavorite.updatedAt,
    });
  }
}
