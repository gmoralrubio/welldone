export interface PasswordResetToken {
  id: number;
  userId: number;
  tokenHash: string;
  expiresAt: Date;
}

export interface PasswordResetTokenRepository {
  create(userId: number, tokenHash: string, expiresAt: Date): Promise<PasswordResetToken>;

  findByTokenHash(tokenHash: string): Promise<PasswordResetToken | null>;

  deleteByUserId(userId: number): Promise<void>;

  resetPassword(tokenHash: string, hashedPassword: string): Promise<boolean>;
}
