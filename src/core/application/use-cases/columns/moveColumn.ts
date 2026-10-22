import type { Column } from "../../../domain/entities/column";
import { calculatePositionAtIndex } from "../../../domain/services/positioning";
import type { AppDependencies } from "../../ports";
import type { MoveColumnInput } from "../../schemas/columnSchemas";

import { findColumnForMember } from "./findColumnForMember";
import { publishColumnsChanged } from "./publishColumnsChanged";

type MoveColumnDependencies = Pick<
  AppDependencies,
  "columns" | "members" | "projects" | "realtime"
>;

export async function moveColumn(
  dependencies: MoveColumnDependencies,
  actorId: string,
  columnId: string,
  { targetIndex }: MoveColumnInput,
): Promise<Column> {
  const column = await findColumnForMember(dependencies, actorId, columnId);
  const otherColumns = (await dependencies.columns.listByProject(column.projectId)).filter(
    (candidate) => candidate.id !== columnId,
  );
  const position = calculatePositionAtIndex(
    otherColumns.map((candidate) => candidate.position),
    targetIndex,
  );
  let movedColumn: Column;
  if (position === null) {
    const orderedIds = otherColumns.map((candidate) => candidate.id);
    orderedIds.splice(targetIndex, 0, columnId);
    await dependencies.columns.rebalancePositions(column.projectId, orderedIds);
    movedColumn = { ...column, position: (orderedIds.indexOf(columnId) + 1) * 1000 };
  } else {
    movedColumn = await dependencies.columns.updatePosition(columnId, position);
  }
  await publishColumnsChanged(dependencies, column.projectId, actorId);
  return movedColumn;
}
