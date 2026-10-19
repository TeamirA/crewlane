import type { Project, ProjectSummary } from "../entities/project";

export interface CreateProjectData {
  name: string;
  description: string | null;
  ownerId: string;
  columnNames: readonly string[];
}

export interface UpdateProjectData {
  name?: string;
  description?: string | null;
}

export interface ProjectRepository {
  create(data: CreateProjectData): Promise<Project>;
  findById(projectId: string): Promise<Project | null>;
  findAllForUser(userId: string): Promise<ProjectSummary[]>;
  update(projectId: string, data: UpdateProjectData): Promise<Project>;
  delete(projectId: string): Promise<void>;
}
