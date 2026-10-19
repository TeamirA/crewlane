import type { PrismaClient } from "@prisma/client";

import type { CreateUserData, UserRepository } from "@/core/domain/repositories/userRepository";

import { userSelect, userSummarySelect } from "../mappers/selects";

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findById(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId }, select: userSelect });
  }

  findByEmailWithPasswordHash(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: { ...userSelect, passwordHash: true },
    });
  }

  findByEmailOrUsername(identifier: string) {
    return this.prisma.user.findFirst({
      where: { OR: [{ email: identifier.toLowerCase() }, { username: identifier }] },
      select: userSelect,
    });
  }

  async existsWithEmailOrUsername(email: string, username: string) {
    const count = await this.prisma.user.count({ where: { OR: [{ email }, { username }] } });
    return count > 0;
  }

  findManyByUsernames(usernames: string[]) {
    return this.prisma.user.findMany({
      where: { username: { in: usernames } },
      select: userSummarySelect,
    });
  }

  create(data: CreateUserData) {
    return this.prisma.user.create({ data, select: userSelect });
  }
}
