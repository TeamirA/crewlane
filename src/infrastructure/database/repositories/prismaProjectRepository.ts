import type { PrismaClient } from "@prisma/client";

import type { ProjectSummary } from "@/core/domain/entities/project";
import type {
  CreateProjectData,
  ProjectRepository,
  UpdateProjectData,
} from "@/core/domain/repositories/projectRepository";

const COLUMN_POSITION_STEP = 1000;

export class PrismaProjectRepository implements ProjectRepository {
  constructor(private readonly prisma: PrismaClient) {}

  create({ name, description, ownerId, columnNames }: CreateProjectData) {
    return this.prisma.project.create({
      data: {
        name,
        description,
        members: { create: { userId: ownerId, role: "OWNER" } },
        columns: {
          create: columnNames.map((columnName, index) => ({
            name: columnName,
            position: (index + 1) * COLUMN_POSITION_STEP,
          })),
        },
      },
    });
  }

  findById(projectId: string) {
    return this.prisma.project.findUnique({ where: { id: projectId } });
  }

  async findAllForUser(userId: string): Promise<ProjectSummary[]> {
    const memberships = await this.prisma.projectMember.findMany({
      where: { userId },
      orderBy: { project: { updatedAt: "desc" } },
      include: {
        project: { include: { _count: { select: { members: true, tasks: true } } } },
      },
    });
    return memberships.map(({ role, project: { _count, ...project } }) => ({
      ...project,
      currentUserRole: role,
      memberCount: _count.members,
      taskCount: _count.tasks,
    }));
  }

  update(projectId: string, data: UpdateProjectData) {
    return this.prisma.project.update({ where: { id: projectId }, data });
  }

  async delete(projectId: string) {
    await this.prisma.project.delete({ where: { id: projectId } });
  }
}
