import type { UserSummaryDto } from "./user";

export type ProjectRoleDto = "OWNER" | "ADMIN" | "MEMBER";

export interface ProjectDto {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectSummaryDto extends ProjectDto {
  currentUserRole: ProjectRoleDto;
  memberCount: number;
  taskCount: number;
}

export interface ProjectMemberDto {
  id: string;
  projectId: string;
  role: ProjectRoleDto;
  joinedAt: string;
  user: UserSummaryDto;
}

export interface ProjectDetailsDto {
  project: ProjectDto;
  currentUserRole: ProjectRoleDto;
  members: ProjectMemberDto[];
}
