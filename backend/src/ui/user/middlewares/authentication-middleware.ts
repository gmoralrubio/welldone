import { Request, Response, NextFunction } from 'express';
import { SecurityServiceImplementation } from '@infrastructure/user/services/SecurityServiceImplementation';
import { UnauthorizedError } from '@domain/errors/UnauthorizedError';

export const authenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    throw new UnauthorizedError('Token missing in request');
  }

  const token = authToken.replace('Bearer ', '');
  const securityService = new SecurityServiceImplementation();
  const decodedToken = securityService.verifyJWT(token);
  req.authorId = decodedToken?.authorId;

  if (decodedToken) {
    next();
  } else {
    throw new UnauthorizedError('Invalid Token');
  }
};
