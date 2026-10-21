import type { ProjectMember } from "../../../domain/entities/projectMember";
import { ForbiddenError } from "../../../domain/errors/domainErrors";
import { requireProjectMembership } from "../../policies/requireProjectMembership";
import type { AppDependencies } from "../../ports";
import type { UpdateMemberRoleInput } from "../../schemas/projectSchemas";

import { findMemberInProject } from "./findMemberInProject";

export async function updateMemberRole(
  dependencies: Pick<AppDependencies, "projects" | "members">,
  actorId: string,
  projectId: string,
  memberId: string,
  { role }: UpdateMemberRoleInput,
): Promise<ProjectMember> {
  await requireProjectMembership(dependencies, projectId, actorId, "OWNER");
  const member = await findMemberInProject(dependencies, projectId, memberId);
  if (member.role === "OWNER") {
    throw new ForbiddenError("The project owner's role cannot be changed");
  }
  return dependencies.members.updateRole(memberId, role);
}
