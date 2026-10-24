import type { UserSummary } from "../../../domain/entities/user";
import { extractMentionedUsernames } from "../../../domain/services/mentions";
import type { AppDependencies } from "../../ports";

// Only project members can be mentioned, and authors never mention themselves.
export async function resolveMentionedMembers(
  { users, members }: Pick<AppDependencies, "users" | "members">,
  projectId: string,
  authorId: string,
  commentBody: string,
): Promise<UserSummary[]> {
  const usernames = extractMentionedUsernames(commentBody);
  if (usernames.length === 0) return [];
  const [mentionedUsers, projectMembers] = await Promise.all([
    users.findManyByUsernames(usernames),
    members.listByProject(projectId),
  ]);
  const memberIds = new Set(projectMembers.map((member) => member.user.id));
  return mentionedUsers.filter((user) => memberIds.has(user.id) && user.id !== authorId);
}
