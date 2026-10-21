import { DEFAULT_COLUMN_NAMES } from "@/lib/constants";

import type { Project } from "../../../domain/entities/project";
import type { AppDependencies } from "../../ports";
import type { CreateProjectInput } from "../../schemas/projectSchemas";

export function createProject(
  { projects }: Pick<AppDependencies, "projects">,
  actorId: string,
  { name, description }: CreateProjectInput,
): Promise<Project> {
  return projects.create({
    name,
    description: description ?? null,
    ownerId: actorId,
    columnNames: DEFAULT_COLUMN_NAMES,
  });
}
