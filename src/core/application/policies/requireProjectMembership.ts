import {
  hasRoleAtLeast,
  type ProjectMember,
  type ProjectRole,
} from "../../domain/entities/projectMember";
import { ForbiddenError, NotFoundError } from "../../domain/errors/domainErrors";
import type { AppDependencies } from "../ports";

type MembershipDependencies = Pick<AppDependencies, "members" | "projects">;

export async function requireProjectMembership(
  { members, projects }: MembershipDependencies,
  projectId: string,
  userId: string,
  minimumRole: ProjectRole = "MEMBER",
): Promise<ProjectMember> {
  const membership = await members.findMembership(projectId, userId);
  if (!membership) {
    const project = await projects.findById(projectId);
    if (!project) {
      throw new NotFoundError("Project not found");
    }
    throw new ForbiddenError("You are not a member of this project");
  }
  if (!hasRoleAtLeast(membership.role, minimumRole)) {
    throw new ForbiddenError(`This action requires the ${minimumRole.toLowerCase()} role`);
  }
  return membership;
}
