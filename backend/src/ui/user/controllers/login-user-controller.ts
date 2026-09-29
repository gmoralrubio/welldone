import { LoginUserUseCase } from "../../../domain/user/use-cases/login-user";
import { PrismaUserRepository } from "@infrastructure/user/repositories/PrismaUserRepository";
import { SecurityServiceImplementation } from "@infrastructure/user/services/SecurityServiceImplementation";
import { NextFunction, Request, Response } from "express";

export const loginUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    res.status(400).json({ error: "Inputs email and password are mandatory." });
    return;
  }

  const userRepository = new PrismaUserRepository();
  const securityService = new SecurityServiceImplementation();
  const loginUserUseCase = new LoginUserUseCase(
    userRepository,
    securityService,
  );
  try {
    const token = await loginUserUseCase.execute({
      identifier,
      password,
    });

    res.status(200).json({
      accessToken: token,
    });
  } catch (error) {
    next(error);
  }
};
