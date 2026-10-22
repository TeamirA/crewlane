import type { Column } from "../../../domain/entities/column";
import type { ProjectRole } from "../../../domain/entities/projectMember";
import { NotFoundError } from "../../../domain/errors/domainErrors";
import { requireProjectMembership } from "../../policies/requireProjectMembership";
import type { AppDependencies } from "../../ports";

export async function findColumnForMember(
  dependencies: Pick<AppDependencies, "columns" | "members" | "projects">,
  actorId: string,
  columnId: string,
  minimumRole: ProjectRole = "MEMBER",
): Promise<Column> {
  const column = await dependencies.columns.findById(columnId);
  if (!column) {
    throw new NotFoundError("Column not found");
  }
  await requireProjectMembership(dependencies, column.projectId, actorId, minimumRole);
  return column;
}
