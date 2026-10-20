import "server-only";

import type { AppDependencies } from "@/core/application/ports";

import { BcryptPasswordHasher } from "./auth/bcryptPasswordHasher";
import { JoseTokenService } from "./auth/joseTokenService";
import { getServerEnv } from "./config/serverEnv";
import { prisma } from "./database/prismaClient";
import { PrismaActivityLogRepository } from "./database/repositories/prismaActivityLogRepository";
import { PrismaColumnRepository } from "./database/repositories/prismaColumnRepository";
import { PrismaCommentRepository } from "./database/repositories/prismaCommentRepository";
import { PrismaLabelRepository } from "./database/repositories/prismaLabelRepository";
import { PrismaNotificationRepository } from "./database/repositories/prismaNotificationRepository";
import { PrismaProjectMemberRepository } from "./database/repositories/prismaProjectMemberRepository";
import { PrismaProjectRepository } from "./database/repositories/prismaProjectRepository";
import { PrismaRefreshTokenRepository } from "./database/repositories/prismaRefreshTokenRepository";
import { PrismaTaskRepository } from "./database/repositories/prismaTaskRepository";
import { PrismaUserRepository } from "./database/repositories/prismaUserRepository";
import { PostgresRateLimiter } from "./rate-limit/postgresRateLimiter";
import { NoopRealtimePublisher } from "./realtime/noopRealtimePublisher";

let dependencies: AppDependencies | null = null;

function createDependencies(): AppDependencies {
  const env = getServerEnv();
  return {
    users: new PrismaUserRepository(prisma),
    refreshTokens: new PrismaRefreshTokenRepository(prisma),
    projects: new PrismaProjectRepository(prisma),
    members: new PrismaProjectMemberRepository(prisma),
    columns: new PrismaColumnRepository(prisma),
    tasks: new PrismaTaskRepository(prisma),
    labels: new PrismaLabelRepository(prisma),
    comments: new PrismaCommentRepository(prisma),
    notifications: new PrismaNotificationRepository(prisma),
    activity: new PrismaActivityLogRepository(prisma),
    passwordHasher: new BcryptPasswordHasher(),
    tokens: new JoseTokenService(env.JWT_ACCESS_SECRET, env.JWT_REFRESH_SECRET),
    rateLimiter: new PostgresRateLimiter(prisma),
    realtime: new NoopRealtimePublisher(),
  };
}

export function getDependencies(): AppDependencies {
  dependencies ??= createDependencies();
  return dependencies;
}
