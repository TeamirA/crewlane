import type { ProjectMember } from "../../../domain/entities/projectMember";
import { ConflictError, NotFoundError } from "../../../domain/errors/domainErrors";
import { requireProjectMembership } from "../../policies/requireProjectMembership";
import type { AppDependencies } from "../../ports";
import type { InviteMemberInput } from "../../schemas/projectSchemas";

type InviteDependencies = Pick<
  AppDependencies,
  "projects" | "members" | "users" | "activity" | "realtime"
>;

export async function inviteProjectMember(
  dependencies: InviteDependencies,
  actorId: string,
  projectId: string,
  { identifier, role }: InviteMemberInput,
): Promise<ProjectMember> {
  await requireProjectMembership(dependencies, projectId, actorId, "ADMIN");
  const invitee = await dependencies.users.findByEmailOrUsername(identifier);
  if (!invitee) {
    throw new NotFoundError("No user found with that email or username");
  }
  if (await dependencies.members.findMembership(projectId, invitee.id)) {
    throw new ConflictError(`${invitee.displayName} is already a member of this project`);
  }
  const member = await dependencies.members.add(projectId, invitee.id, role);
  await dependencies.activity.record({
    projectId,
    actorId,
    type: "MEMBER_JOINED",
    metadata: { memberName: invitee.displayName },
  });
  await dependencies.realtime.publishToProject(projectId, {
    name: "member.joined",
    actorId,
    payload: { member },
  });
  return member;
}
