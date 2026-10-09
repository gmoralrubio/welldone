import { NextFunction, Request, Response } from "express";
import { UpdateUserUseCase } from "../../../domain/user/use-cases/update-user";
import { PrismaUserRepository } from "@infrastructure/user/repositories/PrismaUserRepository";
import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError";
import { ValidationError } from "../../../domain/errors/ValidationError";
import { UpdateUserData } from "../../../domain/user/repositories/UserRepository";

export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authorId = req.authorId;

    if (typeof authorId !== "number") {
      throw new UnauthorizedError("User not authenticated");
    }

    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      throw new ValidationError("Invalid request body");
    }

    const allowedFields = ["name", "surname", "username", "email"];

    const receivedFields = Object.keys(req.body);

    if (receivedFields.length === 0) {
      throw new ValidationError("At least one field is required");
    }

    const invalidFields = receivedFields.filter(
      (field) => !allowedFields.includes(field),
    );

    if (invalidFields.length > 0) {
      throw new ValidationError("Invalid fields in request");
    }

    const input: UpdateUserData = {
      ...(req.body.name !== undefined && { name: req.body.name }),
      ...(req.body.surname !== undefined && { surname: req.body.surname }),
      ...(req.body.username !== undefined && { username: req.body.username }),
      ...(req.body.email !== undefined && { email: req.body.email }),
    };

    const userRepository = new PrismaUserRepository();
    const updateUserUseCase = new UpdateUserUseCase(userRepository);

    const updatedUser = await updateUserUseCase.execute(authorId, input);

    res.status(200).json({
      id: updatedUser.id,
      name: updatedUser.name,
      surname: updatedUser.surname,
      username: updatedUser.username,
      email: updatedUser.email,
    });
  } catch (error) {
    next(error);
  }
};
