import { ConflictError } from "../../../domain/errors/domainErrors";
import type { AppDependencies } from "../../ports";

import { findColumnForMember } from "./findColumnForMember";
import { publishColumnsChanged } from "./publishColumnsChanged";

export async function deleteColumn(
  dependencies: Pick<AppDependencies, "columns" | "members" | "projects" | "realtime">,
  actorId: string,
  columnId: string,
): Promise<void> {
  const column = await findColumnForMember(dependencies, actorId, columnId, "ADMIN");
  const projectColumns = await dependencies.columns.listByProject(column.projectId);
  if (projectColumns.length <= 1) {
    throw new ConflictError("A board needs at least one column");
  }
  await dependencies.columns.delete(columnId);
  await publishColumnsChanged(dependencies, column.projectId, actorId);
}
