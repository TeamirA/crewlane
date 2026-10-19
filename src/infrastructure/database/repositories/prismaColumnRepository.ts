import type { PrismaClient } from "@prisma/client";

import type { ColumnRepository } from "@/core/domain/repositories/columnRepository";

const columnSelect = { id: true, projectId: true, name: true, position: true } as const;

export class PrismaColumnRepository implements ColumnRepository {
  constructor(private readonly prisma: PrismaClient) {}

  listByProject(projectId: string) {
    return this.prisma.column.findMany({
      where: { projectId },
      orderBy: { position: "asc" },
      select: columnSelect,
    });
  }

  findById(columnId: string) {
    return this.prisma.column.findUnique({ where: { id: columnId }, select: columnSelect });
  }

  create(projectId: string, name: string, position: number) {
    return this.prisma.column.create({
      data: { projectId, name, position },
      select: columnSelect,
    });
  }

  rename(columnId: string, name: string) {
    return this.prisma.column.update({
      where: { id: columnId },
      data: { name },
      select: columnSelect,
    });
  }

  updatePosition(columnId: string, position: number) {
    return this.prisma.column.update({
      where: { id: columnId },
      data: { position },
      select: columnSelect,
    });
  }

  async rebalancePositions(projectId: string, orderedColumnIds: string[]) {
    await this.prisma.$transaction(
      orderedColumnIds.map((columnId, index) =>
        this.prisma.column.update({
          where: { id: columnId, projectId },
          data: { position: (index + 1) * 1000 },
        }),
      ),
    );
  }

  async delete(columnId: string) {
    await this.prisma.column.delete({ where: { id: columnId } });
  }
}
