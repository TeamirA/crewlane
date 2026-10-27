import { hasRoleAtLeast } from "@/core/domain/entities/projectMember";
import type { ProjectMemberDto, ProjectRoleDto } from "@/types/project";

// Mirrors the server-side rules so the UI only offers actions that will succeed.
export function getMemberPermissions(
  member: ProjectMemberDto,
  currentUserId: string,
  currentUserRole: ProjectRoleDto,
) {
  const isSelf = member.user.id === currentUserId;
  const isOwner = member.role === "OWNER";
  const canManage =
    hasRoleAtLeast(currentUserRole, "ADMIN") && hasRoleAtLeast(currentUserRole, member.role);
  return {
    isSelf,
    canChangeRole: currentUserRole === "OWNER" && !isOwner,
    canRemove: !isOwner && (isSelf || canManage),
  };
}
