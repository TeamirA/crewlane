import type { PrismaClient } from "@prisma/client";

import type {
  CreateNotificationData,
  NotificationRepository,
} from "@/core/domain/repositories/notificationRepository";

import { mapNotification } from "../mappers/mapNotification";
import { notificationInclude } from "../mappers/selects";

export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createMany(data: CreateNotificationData[]) {
    const records = await this.prisma.$transaction(
      data.map((notification) =>
        this.prisma.notification.create({ data: notification, include: notificationInclude }),
      ),
    );
    return records.map(mapNotification);
  }

  async listForUser(userId: string, limit: number) {
    const records = await this.prisma.notification.findMany({
      where: { recipientId: userId },
      include: notificationInclude,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return records.map(mapNotification);
  }

  countUnread(userId: string) {
    return this.prisma.notification.count({ where: { recipientId: userId, readAt: null } });
  }

  async findById(notificationId: string) {
    const record = await this.prisma.notification.findUnique({
      where: { id: notificationId },
      include: notificationInclude,
    });
    return record ? mapNotification(record) : null;
  }

  async markAsRead(notificationId: string) {
    const record = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: new Date() },
      include: notificationInclude,
    });
    return mapNotification(record);
  }

  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { recipientId: userId, readAt: null },
      data: { readAt: new Date() },
    });
    return result.count;
  }
}
