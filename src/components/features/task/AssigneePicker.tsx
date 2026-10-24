"use client";

import { Avatar } from "@/components/ui/Avatar";
import type { UserSummaryDto } from "@/types/user";

import { ToggleChip } from "./ToggleChip";
import { toggleId } from "./toggleId";

interface AssigneePickerProps {
  members: UserSummaryDto[];
  assigneeIds: string[];
  onChange: (assigneeIds: string[]) => void;
}

export function AssigneePicker({ members, assigneeIds, onChange }: AssigneePickerProps) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1.5 text-sm font-medium text-neutral-800">Assignees</legend>
      {members.map((member) => (
        <ToggleChip
          key={member.id}
          isSelected={assigneeIds.includes(member.id)}
          onToggle={() => onChange(toggleId(assigneeIds, member.id))}
        >
          <Avatar name={member.displayName} seed={member.id} size="xs" />
          <span className="truncate">{member.displayName}</span>
        </ToggleChip>
      ))}
    </fieldset>
  );
}
