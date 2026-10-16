import { NextFunction, Request, Response } from 'express';
import { ForgotPasswordUseCase } from '@domain/user/use-cases/forgot-password';
import { PrismaUserRepository } from '@infrastructure/user/repositories/PrismaUserRepository';
import { PrismaPasswordResetTokenRepository } from '@infrastructure/user/repositories/PrismaPasswordResetTokenRepository';
import { NodemailerEmailService } from '@infrastructure/user/services/NodeMailerEmailService';
import { environmentService } from '@infrastructure/shared/services/EnvironmentService';

export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, locale } = req.body ?? {};

  if (typeof email !== 'string' || !email.trim()) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  if (locale !== 'es' && locale !== 'en') {
    res.status(400).json({ error: 'Invalid locale' });
    return;
  }

  try {
    const { FRONTEND_URL } = environmentService.get();

    const forgotPasswordUseCase = new ForgotPasswordUseCase(
      new PrismaUserRepository(),
      new PrismaPasswordResetTokenRepository(),
      new NodemailerEmailService(),
      FRONTEND_URL
    );

    await forgotPasswordUseCase.execute({
      email: email.trim(),
      locale,
    });

    res.status(200).json({
      message: 'PASSWORD_RESET_EMAIL_SENT_IF_ACCOUNT_EXISTS',
    });
  } catch (error) {
    next(error);
  }
};
