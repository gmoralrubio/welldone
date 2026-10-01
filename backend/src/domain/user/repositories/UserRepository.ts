import { CreateUserUseCaseInput } from "../use-cases/register-user";
import { User } from "../User";

export interface UserRepository {
  findByUsername: (username: string) => Promise<User | null>;
  findByEmail: (email: string) => Promise<User | null>;
  findById: (id: number) => Promise<User | null>;
  create: (params: CreateUserUseCaseInput) => Promise<User>;
  delete: (id: number) => Promise<void>;
}
