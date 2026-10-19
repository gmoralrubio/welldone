import { Request, Response } from 'express';
import { GetPublicProfileUseCase } from '@domain/user/use-cases/get-public-profile';
import { PrismaUserRepository } from '@infrastructure/user/repositories/PrismaUserRepository'; 

export async function getPublicProfileController(req: Request, res: Response) {
  try {
    const username = req.params.username as string;
    
    const userRepository = new PrismaUserRepository();
    const useCase = new GetPublicProfileUseCase(userRepository);

    const publicProfile = await useCase.execute(username);

    if (!publicProfile) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(publicProfile);
  } catch (error) {
    console.error('Error fetching public profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}