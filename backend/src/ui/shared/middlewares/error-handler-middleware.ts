import { Request, Response, NextFunction } from "express";
import { EntityNotFoundError } from "../../../domain/errors/EntityNotFoundError";
import { BadSyntaxError } from "../../../domain/errors/BadSyntaxError";
import { BusinessConflictError } from "../../../domain/errors/BusinessConflictError";
import { ForbiddenOperationError } from "../../../domain/errors/ForbiddenOperationError";
import { InvalidBookPriceError } from "../../../domain/errors/InvalidBookPriceError";
import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError";
import { ZodError } from "zod";
import * as Sentry from "@sentry/node";
import { ValidationError } from "../../../domain/errors/ValidationError";

export const errorHandlerMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  if (error instanceof BadSyntaxError) {
    res.status(401).json({ error: error.message });
  } else if (error instanceof BusinessConflictError) {
    res.status(409).json({ error: error.message, field: error.field });
  } else if (error instanceof EntityNotFoundError) {
    res.status(404).json({ error: error.message });
  } else if (error instanceof ForbiddenOperationError) {
    res.status(403).json({ error: error.message });
  } else if (error instanceof InvalidBookPriceError) {
    res.status(422).json({ error: error.message });
  } else if (error instanceof UnauthorizedError) {
    res.status(401).json({ error: error.message });
  } else if (error instanceof ValidationError) {
    res.status(401).json({ error: error.message });
  } else if (error instanceof ZodError) {
    console.log(error);
    // Error es un error de Zod
    // error.issues[0].message consulta el 1er error de Zod y te lo devuelve
    res.status(400).json({
      error: error.issues[0].message,
    });
  } else {
    console.error(error);
    console.error(error instanceof Error ? error.stack : error);
    Sentry.captureException(error, {
      extra: {
        path: req.path,
        method: req.method,
        ownerId: req.authorId,
      },
    });
    if (error instanceof Error) {
      return res.status(500).json({
        error: error.message,
      });
    }
    return res.status(500).json({
      error: "Unknown error",
    });
  }
};
