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

  async resetPassword(tokenHash: string, hashedPassword: string): Promise<boolean> {
    return this.prismaClient.$transaction(async (tx) => {
      const token = await tx.passwordResetToken.findUnique({
        where: { tokenHash },
      });

      if (!token || token.expiresAt <= new Date()) {
        return false;
      }

      // Eliminar el token para que no se pueda reusar
      const deletedTokens = await tx.passwordResetToken.deleteMany({
        where: {
          id: token.id,
          tokenHash,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (deletedTokens.count === 0) {
        return false;
      }

      // Actualizar la contraseña con el hash
      await tx.user.update({
        where: { id: token.userId },
        data: { password: hashedPassword },
      });

      // Invalidar cualquier otro enlace pendiente
      await tx.passwordResetToken.deleteMany({
        where: { userId: token.userId },
      });

      return true;
    });
  }
}
