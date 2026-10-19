import { UserRepository } from '../repositories/UserRepository';

export class GetPublicProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(username: string) {

    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      username: user.username,
      bio: user.bio,
    };
  }
}