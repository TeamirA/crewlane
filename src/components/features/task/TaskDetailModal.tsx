"use client";

import { Modal } from "@/components/ui/Modal";
import { useUpdateTask } from "@/hooks/useTaskMutations";
import type { LabelDto, TaskDto } from "@/types/board";
import type { UserSummaryDto } from "@/types/user";

import { DeleteTaskButton } from "./DeleteTaskButton";
import { TaskDescriptionField } from "./TaskDescriptionField";
import { TaskPropertiesPanel } from "./TaskPropertiesPanel";
import { TaskTitleField } from "./TaskTitleField";

interface TaskDetailModalProps {
  task: TaskDto;
  columnName: string;
  members: UserSummaryDto[];
  labels: LabelDto[];
  onClose: () => void;
}

export function TaskDetailModal({
  task,
  columnName,
  members,
  labels,
  onClose,
}: TaskDetailModalProps) {
  const updateTask = useUpdateTask(task.projectId, task.id);
  return (
    <Modal isOpen onClose={onClose} title="Task details" description={`In ${columnName}`} size="lg">
      <div className="grid gap-6 md:grid-cols-[1fr_15rem]">
        <div className="flex min-w-0 flex-col gap-5">
          <TaskTitleField
            key={task.title}
            title={task.title}
            onSave={(title) => updateTask.mutate({ title })}
          />
          <TaskDescriptionField
            key={task.description}
            description={task.description}
            isSaving={updateTask.isPending}
            onSave={(description) => updateTask.mutate({ description })}
          />
          {updateTask.error && (
            <p role="alert" className="text-sm text-red-600">
              {updateTask.error.message}
            </p>
          )}
        </div>
        <aside className="flex flex-col gap-5">
          <TaskPropertiesPanel
            task={task}
            members={members}
            labels={labels}
            onUpdate={(input) => updateTask.mutate(input)}
          />
          <DeleteTaskButton task={task} onDeleted={onClose} />
        </aside>
      </div>
    </Modal>
  );
}
