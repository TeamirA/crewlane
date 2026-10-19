import type { ProjectMember, ProjectRole } from "../entities/projectMember";

export interface ProjectMemberRepository {
  findMembership(projectId: string, userId: string): Promise<ProjectMember | null>;
  findById(memberId: string): Promise<ProjectMember | null>;
  listByProject(projectId: string): Promise<ProjectMember[]>;
  countMembersAmong(projectId: string, userIds: string[]): Promise<number>;
  add(projectId: string, userId: string, role: ProjectRole): Promise<ProjectMember>;
  updateRole(memberId: string, role: ProjectRole): Promise<ProjectMember>;
  remove(memberId: string): Promise<void>;
}
