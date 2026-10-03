import { NextFunction, Request, Response } from "express";
import { CheckAvailabilityUseCase } from "@domain/user/use-cases/check-availability";
import { PrismaUserRepository } from "@infrastructure/user/repositories/PrismaUserRepository";

export const checkAvailabilityController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { field, value } = req.query;

  if (
    (field !== "email" && field !== "username") ||
    typeof value !== "string" ||
    !value
  ) {
    res.status(400).json({ error: "Field and value are mandatory." });
    return;
  }

  const prismaUserRepository = new PrismaUserRepository();
  const checkAvailabilityUseCase = new CheckAvailabilityUseCase(
    prismaUserRepository,
  );

  try {
    const available = await checkAvailabilityUseCase.execute({ field, value });

    return res.status(200).json({ available });
  } catch (error) {
    next(error);
  }
};
