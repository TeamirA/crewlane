"use client";

import { Badge } from "@/components/ui/Badge";
import type { LabelDto } from "@/types/board";

import { CreateLabelForm } from "./CreateLabelForm";
import { ToggleChip } from "./ToggleChip";
import { toggleId } from "./toggleId";

interface LabelPickerProps {
  projectId: string;
  labels: LabelDto[];
  selectedLabelIds: string[];
  onChange: (labelIds: string[]) => void;
}

export function LabelPicker({ projectId, labels, selectedLabelIds, onChange }: LabelPickerProps) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1.5 text-sm font-medium text-neutral-800">Labels</legend>
      {labels.map((label) => (
        <ToggleChip
          key={label.id}
          isSelected={selectedLabelIds.includes(label.id)}
          onToggle={() => onChange(toggleId(selectedLabelIds, label.id))}
        >
          <Badge color={label.color}>{label.name}</Badge>
        </ToggleChip>
      ))}
      <CreateLabelForm projectId={projectId} />
    </fieldset>
  );
}
