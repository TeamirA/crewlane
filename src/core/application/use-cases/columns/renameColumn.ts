import type { Column } from "../../../domain/entities/column";
import type { AppDependencies } from "../../ports";
import type { RenameColumnInput } from "../../schemas/columnSchemas";

import { findColumnForMember } from "./findColumnForMember";
import { publishColumnsChanged } from "./publishColumnsChanged";

export async function renameColumn(
  dependencies: Pick<AppDependencies, "columns" | "members" | "projects" | "realtime">,
  actorId: string,
  columnId: string,
  { name }: RenameColumnInput,
): Promise<Column> {
  const column = await findColumnForMember(dependencies, actorId, columnId);
  const renamedColumn = await dependencies.columns.rename(columnId, name);
  await publishColumnsChanged(dependencies, column.projectId, actorId);
  return renamedColumn;
}
