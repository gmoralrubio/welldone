import { NextFunction, Request, Response } from "express";
import { GetCurrentUserUseCase } from "../../../domain/user/use-cases/get-current-user";
import { PrismaUserRepository } from "@infrastructure/user/repositories/PrismaUserRepository";
import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError";

export const getCurrentUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userRepository = new PrismaUserRepository();
    const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);

    const authorId = req.authorId;

    if (typeof authorId !== "number") {
      throw new UnauthorizedError("User not authenticated");
    }

    const user = await getCurrentUserUseCase.execute(authorId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      surname: user.surname,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};
