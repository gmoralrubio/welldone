import { UserRepository } from "../repositories/UserRepository";
import { EntityNotFoundError } from "../../errors/EntityNotFoundError";

export class GetProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number) {
    const user = await this.userRepository.findById(id);
    
    if (!user) {
      throw new EntityNotFoundError("User", String(id));
    }
    
    const { password, ...userWithoutPassword } = user;
    
    return userWithoutPassword;
  }
}