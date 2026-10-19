import type { PrismaClient } from "@prisma/client";

import type {
  CreateRefreshTokenData,
  RefreshTokenRepository,
} from "@/core/domain/repositories/refreshTokenRepository";

export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private readonly prisma: PrismaClient) {}

  create(data: CreateRefreshTokenData) {
    return this.prisma.refreshToken.create({ data });
  }

  findByTokenHash(tokenHash: string) {
    return this.prisma.refreshToken.findUnique({ where: { tokenHash } });
  }

  async revoke(tokenId: string) {
    await this.prisma.refreshToken.update({
      where: { id: tokenId },
      data: { revokedAt: new Date() },
    });
  }

  async revokeFamily(familyId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { familyId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
