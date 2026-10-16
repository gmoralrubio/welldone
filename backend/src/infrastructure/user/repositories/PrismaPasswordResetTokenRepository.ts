import prismaClient from '@infrastructure/shared/prisma-client';
import {
  PasswordResetToken,
  PasswordResetTokenRepository,
} from '@domain/user/repositories/PasswordResetTokenRepository';

export class PrismaPasswordResetTokenRepository implements PasswordResetTokenRepository {
  private readonly prismaClient = prismaClient;

  async create(
    userId: number,
    tokenHash: string,
    expiresAt: Date
  ): Promise<PasswordResetToken> {
    return this.prismaClient.passwordResetToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });
  }

  async findByTokenHash(tokenHash: string): Promise<PasswordResetToken | null> {
    return this.prismaClient.passwordResetToken.findUnique({
      where: { tokenHash },
    });
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.prismaClient.passwordResetToken.deleteMany({
      where: { userId },
    });
  }
}
