import { hasRoleAtLeast } from "../../../domain/entities/projectMember";
import { ForbiddenError } from "../../../domain/errors/domainErrors";
import { requireProjectMembership } from "../../policies/requireProjectMembership";
import type { AppDependencies } from "../../ports";

import { findMemberInProject } from "./findMemberInProject";

export async function removeProjectMember(
  dependencies: Pick<AppDependencies, "projects" | "members">,
  actorId: string,
  projectId: string,
  memberId: string,
): Promise<void> {
  const actorMembership = await requireProjectMembership(dependencies, projectId, actorId);
  const member = await findMemberInProject(dependencies, projectId, memberId);
  if (member.role === "OWNER") {
    throw new ForbiddenError("The project owner cannot be removed");
  }
  const isLeavingProject = member.user.id === actorId;
  const canManageMember =
    hasRoleAtLeast(actorMembership.role, "ADMIN") &&
    hasRoleAtLeast(actorMembership.role, member.role);
  if (!isLeavingProject && !canManageMember) {
    throw new ForbiddenError("You do not have permission to remove this member");
  }
  await dependencies.members.remove(memberId);
}
