"use client";

import { Modal } from "@/components/ui/Modal";
import { useUpdateTask } from "@/hooks/useTaskMutations";
import type { LabelDto, TaskDto } from "@/types/board";
import type { UserSummaryDto } from "@/types/user";

import { DeleteTaskButton } from "./DeleteTaskButton";
import { TaskMainPanel } from "./TaskMainPanel";
import { TaskPropertiesPanel } from "./TaskPropertiesPanel";

interface TaskDetailModalProps {
  task: TaskDto;
  columnName: string;
  members: UserSummaryDto[];
  labels: LabelDto[];
  onClose: () => void;
}

export function TaskDetailModal(props: TaskDetailModalProps) {
  const { task, columnName, members, labels, onClose } = props;
  const updateTask = useUpdateTask(task.projectId, task.id);
  const handleUpdate = updateTask.mutate;
  return (
    <Modal isOpen onClose={onClose} title="Task details" description={`In ${columnName}`} size="lg">
      <div className="grid gap-6 md:grid-cols-[1fr_15rem]">
        <TaskMainPanel
          task={task}
          isSaving={updateTask.isPending}
          errorMessage={updateTask.error?.message}
          onUpdate={handleUpdate}
        />
        <aside aria-label="Task properties" className="flex flex-col gap-5">
          <TaskPropertiesPanel
            task={task}
            members={members}
            labels={labels}
            onUpdate={handleUpdate}
          />
          <DeleteTaskButton task={task} onDeleted={onClose} />
        </aside>
      </div>
    </Modal>
  );
}
