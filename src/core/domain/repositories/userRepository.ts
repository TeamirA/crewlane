import type { User, UserSummary, UserWithPasswordHash } from "../entities/user";

export interface CreateUserData {
  email: string;
  username: string;
  displayName: string;
  passwordHash: string;
}

export interface UserRepository {
  findById(userId: string): Promise<User | null>;
  findByEmailWithPasswordHash(email: string): Promise<UserWithPasswordHash | null>;
  findByEmailOrUsername(identifier: string): Promise<User | null>;
  existsWithEmailOrUsername(email: string, username: string): Promise<boolean>;
  findManyByUsernames(usernames: string[]): Promise<UserSummary[]>;
  create(data: CreateUserData): Promise<User>;
}
