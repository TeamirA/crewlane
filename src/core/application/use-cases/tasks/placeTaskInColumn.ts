import type { Task } from "../../../domain/entities/task";
import type { TaskRepository } from "../../../domain/repositories/taskRepository";
import { calculatePositionAtIndex, POSITION_STEP } from "../../../domain/services/positioning";

export async function placeTaskInColumn(
  tasks: TaskRepository,
  taskId: string,
  columnId: string,
  targetIndex: number,
): Promise<Task> {
  const siblings = (await tasks.listPositionsInColumn(columnId)).filter(
    (sibling) => sibling.id !== taskId,
  );
  const position = calculatePositionAtIndex(
    siblings.map((sibling) => sibling.position),
    targetIndex,
  );
  if (position !== null) {
    return tasks.move(taskId, columnId, position);
  }
  // Neighbouring positions ran out of precision: renumber the column, then insert.
  const orderedIds = siblings.map((sibling) => sibling.id);
  orderedIds.splice(targetIndex, 0, taskId);
  await tasks.rebalancePositions(orderedIds);
  return tasks.move(taskId, columnId, (orderedIds.indexOf(taskId) + 1) * POSITION_STEP);
}
