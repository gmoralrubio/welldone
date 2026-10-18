import { NextFunction, Request, Response } from 'express';
import { ResetPasswordUseCase } from '@domain/user/use-cases/reset-password';
import { PrismaPasswordResetTokenRepository } from '@infrastructure/user/repositories/PrismaPasswordResetTokenRepository';
import { SecurityServiceImplementation } from '@infrastructure/user/services/SecurityServiceImplementation';

export const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token, password } = req.body ?? {};

  // Comprobar datos
  if (
    typeof token !== 'string' ||
    !token.trim() ||
    typeof password !== 'string' ||
    !password
  ) {
    res.status(400).json({
      error: 'Token and password are required',
    });
    return;
  }

  try {
    const tokenRepository = new PrismaPasswordResetTokenRepository();
    const securityService = new SecurityServiceImplementation();

    const resetPasswordUseCase = new ResetPasswordUseCase(
      tokenRepository,
      securityService
    );

    await resetPasswordUseCase.execute({
      token,
      password,
    });

    res.status(200).json({
      message: 'PASSWORD_RESET_SUCCESSFULLY',
    });
  } catch (error) {
    next(error);
  }
};
