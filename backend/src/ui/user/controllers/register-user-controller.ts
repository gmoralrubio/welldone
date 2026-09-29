import { NextFunction, Request, Response } from "express";
import { CreateUserUseCase } from "@domain/user/use-cases/register-user";
import { SecurityServiceImplementation } from "@infrastructure/user/services/SecurityServiceImplementation";
import { PrismaUserRepository } from "@infrastructure/user/repositories/PrismaUserRepository";

export const registerUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password, username, name, surname } = req.body;

  if (!email || !password || !username || !name || !surname) {
    res.status(400).json({
      error: "Email, password, username, name and surname are mandatory.",
    });
    return;
  }

  const prismaUserRepository = new PrismaUserRepository();
  const securityService = new SecurityServiceImplementation();
  const createUserUseCase = new CreateUserUseCase(
    prismaUserRepository,
    securityService,
  );
  try {
    await createUserUseCase.execute({
      email,
      password,
      username,
      name,
      surname,
    });

    return res.status(201).json({ message: "USER_CREATED_SUCCESSFULLY" });
  } catch (error) {
    next(error);
  }
};
