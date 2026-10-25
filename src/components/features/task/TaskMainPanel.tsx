"use client";

import { CommentThread } from "@/components/features/comment/CommentThread";
import type { UpdateTaskInput } from "@/core/application/schemas/taskSchemas";
import type { TaskDto } from "@/types/board";
import type { UserSummaryDto } from "@/types/user";

import { TaskDescriptionField } from "./TaskDescriptionField";
import { TaskDetailSection } from "./TaskDetailSection";
import { TaskTitleField } from "./TaskTitleField";

interface TaskMainPanelProps {
  task: TaskDto;
  members: UserSummaryDto[];
  isSaving: boolean;
  errorMessage?: string;
  onUpdate: (input: UpdateTaskInput) => void;
}

export function TaskMainPanel(props: TaskMainPanelProps) {
  const { task, members, isSaving, errorMessage, onUpdate } = props;
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
      <TaskDetailSection title="Comments">
        <CommentThread projectId={task.projectId} taskId={task.id} members={members} />
      </TaskDetailSection>
    </div>
  );
}
