import type { PrismaClient } from "@prisma/client";

import type { LabelRepository } from "@/core/domain/repositories/labelRepository";

export class PrismaLabelRepository implements LabelRepository {
  constructor(private readonly prisma: PrismaClient) {}

  listByProject(projectId: string) {
    return this.prisma.label.findMany({ where: { projectId }, orderBy: { name: "asc" } });
  }

  countInProject(projectId: string, labelIds: string[]) {
    return this.prisma.label.count({ where: { projectId, id: { in: labelIds } } });
  }

  create(projectId: string, name: string, color: string) {
    return this.prisma.label.create({ data: { projectId, name, color } });
  }

  findById(labelId: string) {
    return this.prisma.label.findUnique({ where: { id: labelId } });
  }

  async delete(labelId: string) {
    await this.prisma.label.delete({ where: { id: labelId } });
  }
}
