import type { ProjectMember } from "../../../domain/entities/projectMember";
import { NotFoundError } from "../../../domain/errors/domainErrors";
import type { AppDependencies } from "../../ports";

export async function findMemberInProject(
  { members }: Pick<AppDependencies, "members">,
  projectId: string,
  memberId: string,
): Promise<ProjectMember> {
  const member = await members.findById(memberId);
  if (!member || member.projectId !== projectId) {
    throw new NotFoundError("Member not found in this project");
  }
  return member;
}
