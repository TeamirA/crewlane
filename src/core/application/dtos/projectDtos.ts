import type { Project } from "../../domain/entities/project";
import type { ProjectMember, ProjectRole } from "../../domain/entities/projectMember";

export interface ProjectDetails {
  project: Project;
  currentUserRole: ProjectRole;
  members: ProjectMember[];
}
