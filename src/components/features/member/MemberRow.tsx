"use client";

import { useRouter } from "next/navigation";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { useRemoveMember, useUpdateMemberRole } from "@/hooks/useMemberMutations";
import { ROUTES } from "@/lib/constants";
import { formatRole } from "@/lib/formatting";
import type { ProjectMemberDto, ProjectRoleDto } from "@/types/project";

import { getMemberPermissions } from "./memberPermissions";

interface MemberRowProps {
  member: ProjectMemberDto;
  currentUserId: string;
  currentUserRole: ProjectRoleDto;
}

const roleOptions = [
  { value: "ADMIN", label: "Admin" },
  { value: "MEMBER", label: "Member" },
];

export function MemberRow({ member, currentUserId, currentUserRole }: MemberRowProps) {
  const updateRole = useUpdateMemberRole(member.projectId);
  const removeMember = useRemoveMember(member.projectId);
  const router = useRouter();
  const { canChangeRole, canRemove, isSelf } = getMemberPermissions(
    member,
    currentUserId,
    currentUserRole,
  );
  return (
    <li className="flex flex-wrap items-center gap-3 py-3">
      <Avatar name={member.user.displayName} seed={member.user.id} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {member.user.displayName} {isSelf && <span className="text-neutral-500">(you)</span>}
        </p>
        <p className="truncate text-xs text-neutral-500">@{member.user.username}</p>
      </div>
      {canChangeRole ? (
        <Select
          label={`Role for ${member.user.displayName}`}
          isLabelHidden
          options={roleOptions}
          value={member.role}
          disabled={updateRole.isPending}
          onChange={(event) =>
            updateRole.mutate({ memberId: member.id, role: event.target.value as "ADMIN" })
          }
          containerClassName="w-32"
        />
      ) : (
        <Badge tone={member.role === "OWNER" ? "indigo" : "neutral"}>
          {formatRole(member.role)}
        </Badge>
      )}
      {canRemove && (
        <Button
          variant="ghost"
          size="sm"
          isLoading={removeMember.isPending}
          onClick={() =>
            removeMember.mutate(member.id, {
              onSuccess: () => isSelf && router.replace(ROUTES.projects),
            })
          }
        >
          {isSelf ? "Leave" : "Remove"}
        </Button>
      )}
    </li>
  );
}
