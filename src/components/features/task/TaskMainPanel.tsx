"use client";

import type { UpdateTaskInput } from "@/core/application/schemas/taskSchemas";
import type { TaskDto } from "@/types/board";

import { TaskDescriptionField } from "./TaskDescriptionField";
import { TaskDetailSection } from "./TaskDetailSection";
import { TaskTitleField } from "./TaskTitleField";

interface TaskMainPanelProps {
  task: TaskDto;
  isSaving: boolean;
  errorMessage?: string;
  onUpdate: (input: UpdateTaskInput) => void;
}

export function TaskMainPanel({ task, isSaving, errorMessage, onUpdate }: TaskMainPanelProps) {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <TaskTitleField key={task.title} title={task.title} onSave={(title) => onUpdate({ title })} />
      {errorMessage && (
        <p role="alert" className="text-sm text-red-600">
          {errorMessage}
        </p>
      )}
      <TaskDetailSection title="Description">
        <TaskDescriptionField
          key={task.description}
          description={task.description}
          isSaving={isSaving}
          onSave={(description) => onUpdate({ description })}
        />
      </TaskDetailSection>
    </div>
  );
}
