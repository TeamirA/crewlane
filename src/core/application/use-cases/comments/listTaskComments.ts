import type { Comment } from "../../../domain/entities/comment";
import type { AppDependencies } from "../../ports";
import { findTaskForMember } from "../tasks/findTaskForMember";

export async function listTaskComments(
  dependencies: Pick<AppDependencies, "comments" | "tasks" | "members" | "projects">,
  actorId: string,
  taskId: string,
): Promise<Comment[]> {
  await findTaskForMember(dependencies, actorId, taskId);
  return dependencies.comments.listByTask(taskId);
}
