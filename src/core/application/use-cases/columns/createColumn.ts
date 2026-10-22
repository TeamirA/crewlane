import type { Column } from "../../../domain/entities/column";
import { calculatePositionAfterLast } from "../../../domain/services/positioning";
import { requireProjectMembership } from "../../policies/requireProjectMembership";
import type { AppDependencies } from "../../ports";
import type { CreateColumnInput } from "../../schemas/columnSchemas";

import { publishColumnsChanged } from "./publishColumnsChanged";

type CreateColumnDependencies = Pick<
  AppDependencies,
  "columns" | "members" | "projects" | "activity" | "realtime"
>;

export async function createColumn(
  dependencies: CreateColumnDependencies,
  actorId: string,
  projectId: string,
  { name }: CreateColumnInput,
): Promise<Column> {
  await requireProjectMembership(dependencies, projectId, actorId);
  const existingColumns = await dependencies.columns.listByProject(projectId);
  const position = calculatePositionAfterLast(existingColumns.map((column) => column.position));
  const column = await dependencies.columns.create(projectId, name, position);
  await dependencies.activity.record({
    projectId,
    actorId,
    type: "COLUMN_CREATED",
    metadata: { columnName: name },
  });
  await publishColumnsChanged(dependencies, projectId, actorId);
  return column;
}
