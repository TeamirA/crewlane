import type { UserSummary } from "./user";

export const PROJECT_ROLES = ["OWNER", "ADMIN", "MEMBER"] as const;

export type ProjectRole = (typeof PROJECT_ROLES)[number];

export interface ProjectMember {
  id: string;
  projectId: string;
  role: ProjectRole;
  joinedAt: Date;
  user: UserSummary;
}

const ROLE_RANK: Record<ProjectRole, number> = { OWNER: 3, ADMIN: 2, MEMBER: 1 };

export function hasRoleAtLeast(role: ProjectRole, requiredRole: ProjectRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[requiredRole];
}
