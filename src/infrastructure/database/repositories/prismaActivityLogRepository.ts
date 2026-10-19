import type { PrismaClient } from "@prisma/client";

import type { ActivityMetadata } from "@/core/domain/entities/activityLog";
import type {
  ActivityLogRepository,
  RecordActivityData,
} from "@/core/domain/repositories/activityLogRepository";

import { userSummarySelect } from "../mappers/selects";

export class PrismaActivityLogRepository implements ActivityLogRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async record({ metadata, ...activity }: RecordActivityData) {
    await this.prisma.activityLog.create({ data: { ...activity, metadata } });
  }

  async listByTask(taskId: string, limit: number) {
    const records = await this.prisma.activityLog.findMany({
      where: { taskId },
      include: { actor: { select: userSummarySelect } },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return records.map((record) => ({
      ...record,
      metadata: record.metadata as ActivityMetadata | null,
    }));
  }
}
