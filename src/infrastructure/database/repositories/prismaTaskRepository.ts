import type { PrismaClient } from "@prisma/client";

import type {
  CreateTaskData,
  TaskRepository,
  UpdateTaskData,
} from "@/core/domain/repositories/taskRepository";

import { mapTask } from "../mappers/mapTask";
import { taskInclude } from "../mappers/selects";

function buildRelationReplacements({ assigneeIds, labelIds }: UpdateTaskData) {
  return {
    ...(assigneeIds && {
      assignees: { deleteMany: {}, create: assigneeIds.map((userId) => ({ userId })) },
    }),
    ...(labelIds && {
      labels: { deleteMany: {}, create: labelIds.map((labelId) => ({ labelId })) },
    }),
  };
}

export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(taskId: string) {
    const record = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: taskInclude,
    });
    return record ? mapTask(record) : null;
  }

  async listByProject(projectId: string) {
    const records = await this.prisma.task.findMany({
      where: { projectId },
      include: taskInclude,
      orderBy: { position: "asc" },
    });
    return records.map(mapTask);
  }

  listPositionsInColumn(columnId: string) {
    return this.prisma.task.findMany({
      where: { columnId },
      orderBy: { position: "asc" },
      select: { id: true, position: true },
    });
  }

  async create({ assigneeIds, labelIds, ...taskFields }: CreateTaskData) {
    const record = await this.prisma.task.create({
      data: {
        ...taskFields,
        assignees: { create: assigneeIds.map((userId) => ({ userId })) },
        labels: { create: labelIds.map((labelId) => ({ labelId })) },
      },
      include: taskInclude,
    });
    return mapTask(record);
  }

  async update(taskId: string, data: UpdateTaskData) {
    const { assigneeIds, labelIds, ...scalarFields } = data;
    const record = await this.prisma.task.update({
      where: { id: taskId },
      data: { ...scalarFields, ...buildRelationReplacements({ assigneeIds, labelIds }) },
      include: taskInclude,
    });
    return mapTask(record);
  }

  async move(taskId: string, columnId: string, position: number) {
    const record = await this.prisma.task.update({
      where: { id: taskId },
      data: { columnId, position },
      include: taskInclude,
    });
    return mapTask(record);
  }

  async rebalancePositions(orderedTaskIds: string[]) {
    await this.prisma.$transaction(
      orderedTaskIds.map((taskId, index) =>
        this.prisma.task.update({ where: { id: taskId }, data: { position: (index + 1) * 1000 } }),
      ),
    );
  }

  async delete(taskId: string) {
    await this.prisma.task.delete({ where: { id: taskId } });
  }
}
