import { UserRepository } from "../repositories/UserRepository";
import { User } from "../User";

export class GetCurrentUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: number): Promise<User | null> {
    return this.userRepository.findById(userId);
  }
}
