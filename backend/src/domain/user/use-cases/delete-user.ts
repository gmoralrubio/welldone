import { EntityNotFoundError } from "../../errors/EntityNotFoundError";
import type { UserRepository } from "../repositories/UserRepository";

export class DeleteUserUseCase {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId: number): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new EntityNotFoundError("User", userId);
    }

    await this.userRepository.delete(userId);
  }
}
