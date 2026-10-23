import { ValidationError } from "../../../domain/errors/domainErrors";
import type { AppDependencies } from "../../ports";

interface TaskRelations {
  assigneeIds?: string[];
  labelIds?: string[];
}

// Only project members can be assigned, and only the project's own labels can be attached.
export async function validateTaskRelations(
  { members, labels }: Pick<AppDependencies, "members" | "labels">,
  projectId: string,
  { assigneeIds, labelIds }: TaskRelations,
): Promise<void> {
  if (assigneeIds?.length) {
    const uniqueAssigneeIds = [...new Set(assigneeIds)];
    const memberCount = await members.countMembersAmong(projectId, uniqueAssigneeIds);
    if (memberCount !== uniqueAssigneeIds.length) {
      throw new ValidationError("Only project members can be assigned to a task");
    }
  }
  if (labelIds?.length) {
    const uniqueLabelIds = [...new Set(labelIds)];
    const labelCount = await labels.countInProject(projectId, uniqueLabelIds);
    if (labelCount !== uniqueLabelIds.length) {
      throw new ValidationError("Labels must belong to this project");
    }
  }
}
