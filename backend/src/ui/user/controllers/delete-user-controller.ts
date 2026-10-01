import { NextFunction, Request, Response } from "express";
import { DeleteUserUseCase } from "@domain/user/use-cases/delete-user";
import { PrismaUserRepository } from "@infrastructure/user/repositories/PrismaUserRepository";

export const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.authorId;

  if (!userId) {
    res.status(401).json({
      error: "User not authenticated",
    });
    return;
  }

  const userRepository = new PrismaUserRepository();
  const deleteUserUseCase = new DeleteUserUseCase(userRepository);

  try {
    await deleteUserUseCase.execute(userId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
