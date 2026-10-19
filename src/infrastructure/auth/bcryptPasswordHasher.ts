import bcrypt from "bcryptjs";

import type { PasswordHasher } from "@/core/domain/services/passwordHasher";

const BCRYPT_COST_FACTOR = 12;

export class BcryptPasswordHasher implements PasswordHasher {
  hash(plainPassword: string) {
    return bcrypt.hash(plainPassword, BCRYPT_COST_FACTOR);
  }

  verify(plainPassword: string, passwordHash: string) {
    return bcrypt.compare(plainPassword, passwordHash);
  }
}
