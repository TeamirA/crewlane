import type { PrismaClient } from "@prisma/client";

import type { ProjectRole } from "@/core/domain/entities/projectMember";
import type { ProjectMemberRepository } from "@/core/domain/repositories/projectMemberRepository";

import { memberInclude } from "../mappers/selects";

export class PrismaProjectMemberRepository implements ProjectMemberRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findMembership(projectId: string, userId: string) {
    return this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
      include: memberInclude,
    });
  }

  findById(memberId: string) {
    return this.prisma.projectMember.findUnique({
      where: { id: memberId },
      include: memberInclude,
    });
  }

  listByProject(projectId: string) {
    return this.prisma.projectMember.findMany({
      where: { projectId },
      include: memberInclude,
      orderBy: { joinedAt: "asc" },
    });
  }

  countMembersAmong(projectId: string, userIds: string[]) {
    return this.prisma.projectMember.count({ where: { projectId, userId: { in: userIds } } });
  }

  add(projectId: string, userId: string, role: ProjectRole) {
    return this.prisma.projectMember.create({
      data: { projectId, userId, role },
      include: memberInclude,
    });
  }

  updateRole(memberId: string, role: ProjectRole) {
    return this.prisma.projectMember.update({
      where: { id: memberId },
      data: { role },
      include: memberInclude,
    });
  }

  // Removing a member also unassigns them from every task in that project.
  async remove(memberId: string) {
    await this.prisma.$transaction(async (transaction) => {
      const member = await transaction.projectMember.delete({ where: { id: memberId } });
      await transaction.taskAssignee.deleteMany({
        where: { userId: member.userId, task: { projectId: member.projectId } },
      });
    });
  }
}
