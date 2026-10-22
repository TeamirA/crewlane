import type { ProjectMemberDto, ProjectRoleDto } from "@/types/project";

const ROLE_RANK: Record<ProjectRoleDto, number> = { OWNER: 3, ADMIN: 2, MEMBER: 1 };

// Mirrors the server-side rules so the UI only offers actions that will succeed.
export function getMemberPermissions(
  member: ProjectMemberDto,
  currentUserId: string,
  currentUserRole: ProjectRoleDto,
) {
  const isSelf = member.user.id === currentUserId;
  const isOwner = member.role === "OWNER";
  const canManage =
    ROLE_RANK[currentUserRole] >= ROLE_RANK.ADMIN &&
    ROLE_RANK[currentUserRole] >= ROLE_RANK[member.role];
  return {
    isSelf,
    canChangeRole: currentUserRole === "OWNER" && !isOwner,
    canRemove: !isOwner && (isSelf || canManage),
  };
}
