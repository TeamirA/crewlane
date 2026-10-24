"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { UpdateTaskInput } from "@/core/application/schemas/taskSchemas";
import type { LabelDto, TaskDto, TaskPriorityDto } from "@/types/board";
import type { UserSummaryDto } from "@/types/user";

import { AssigneePicker } from "./AssigneePicker";
import { LabelPicker } from "./LabelPicker";
import { priorityOptions } from "./PriorityBadge";

interface TaskPropertiesPanelProps {
  task: TaskDto;
  members: UserSummaryDto[];
  labels: LabelDto[];
  onUpdate: (input: UpdateTaskInput) => void;
}

export function TaskPropertiesPanel({ task, members, labels, onUpdate }: TaskPropertiesPanelProps) {
  return (
    <div className="flex flex-col gap-5">
      <Select
        label="Priority"
        options={priorityOptions}
        value={task.priority}
        onChange={(event) => onUpdate({ priority: event.target.value as TaskPriorityDto })}
      />
      <Input
        label="Due date"
        type="date"
        value={task.dueDate ? task.dueDate.slice(0, 10) : ""}
        onChange={(event) =>
          onUpdate({ dueDate: event.target.value ? new Date(event.target.value) : null })
        }
      />
      <AssigneePicker
        members={members}
        assigneeIds={task.assignees.map((assignee) => assignee.id)}
        onChange={(assigneeIds) => onUpdate({ assigneeIds })}
      />
      <LabelPicker
        projectId={task.projectId}
        labels={labels}
        selectedLabelIds={task.labels.map((label) => label.id)}
        onChange={(labelIds) => onUpdate({ labelIds })}
      />
    </div>
  );
}
