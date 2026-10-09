import { CreateUserUseCaseInput } from "../use-cases/register-user";
import { User } from "../User";

export interface UpdateUserData {
  name?: string;
  surname?: string;
  username?: string;
  email?: string;
}

export interface UserRepository {
  findByUsername: (username: string) => Promise<User | null>;
  findByEmail: (email: string) => Promise<User | null>;
  findById: (id: number) => Promise<User | null>;
  create: (params: CreateUserUseCaseInput) => Promise<User>;
  update: (id: number, params: UpdateUserData) => Promise<User>;
}
