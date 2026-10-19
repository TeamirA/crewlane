import type { ProjectRole } from "./projectMember";

export interface Project {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectSummary extends Project {
  currentUserRole: ProjectRole;
  memberCount: number;
  taskCount: number;
}
