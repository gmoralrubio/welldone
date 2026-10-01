import { prisma } from "../../prisma-client";
import { UserRepository } from "../../../domain/user/repositories/UserRepository";
import { CreateUserUseCaseInput } from "../../../domain/user/use-cases/register-user";
import { User } from "../../../domain/user/User";

type PrismaUser = {
  id: number;
  email: string;
  password: string;
  username: string;
  name: string;
  surname: string;
  createdAt: Date;
  updatedAt: Date;
};

export class PrismaUserRepository implements UserRepository {
  private readonly prismaClient = prisma;

  async findByUsername(username: string): Promise<User | null> {
    const prismaUser = await this.prismaClient.user.findUnique({
      where: {
        username,
      },
    });

    if (!prismaUser) {
      return null;
    } else {
      return this.restore(prismaUser);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    if (!prismaUser) {
      return null;
    } else {
      return this.restore(prismaUser);
    }
  }
  async findById(id: number): Promise<User | null> {
    const prismaUser = await this.prismaClient.user.findUnique({
      where: {
        id,
      },
    });
    if (!prismaUser) {
      return null;
    }

    return this.restore(prismaUser);
  }

  async create(params: CreateUserUseCaseInput): Promise<User> {
    // Creas el usuario
    const user = await this.prismaClient.user.create({
      data: {
        email: params.email,
        password: params.password,
        username: params.username,
        name: params.name,
        surname: params.surname,
      },
    });

    // Devuelves un nuevo Usuario
    // con los valores que pusiste a la tabla de prisma
    return this.restore(user);
  }

  async delete(id: number): Promise<void> {
    await this.prismaClient.user.delete({
      where: {
        id,
      },
    });
  }

  private restore(prismaUser: PrismaUser): User {
    return new User({
      id: prismaUser.id,
      email: prismaUser.email,
      password: prismaUser.password,
      username: prismaUser.username,
      name: prismaUser.name,
      surname: prismaUser.surname,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }
}
