import { UserRepository } from "../repositories/UserRepository";

export interface CheckAvailabilityUseCaseInput {
  field: "email" | "username";
  value: string;
}

export class CheckAvailabilityUseCase {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(input: CheckAvailabilityUseCaseInput): Promise<boolean> {
    const existingUser =
      input.field === "email"
        ? await this.userRepository.findByEmail(input.value)
        : await this.userRepository.findByUsername(input.value);

    return !existingUser;
  }
}
