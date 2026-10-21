import { Request, Response, NextFunction } from 'express';
import { SecurityServiceImplementation } from '@infrastructure/user/services/SecurityServiceImplementation';
import { UnauthorizedError } from '@domain/errors/UnauthorizedError';

export const authenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.headers.authorization;

  if (!authToken || !authToken.startsWith('Bearer ')) {
    throw new UnauthorizedError('Token missing or invalid');
  }

  const token = authToken.slice(7);

  const securityService = new SecurityServiceImplementation();
  const decodedToken = securityService.verifyJWT(token);

  if (!decodedToken) {
    throw new UnauthorizedError('Invalid or expired token');
  }

  req.authorId = decodedToken.authorId;

  next();
};
