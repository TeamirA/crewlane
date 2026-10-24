"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useDeleteTask } from "@/hooks/useTaskMutations";
import type { TaskDto } from "@/types/board";

export function DeleteTaskButton({ task, onDeleted }: { task: TaskDto; onDeleted: () => void }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const deleteTask = useDeleteTask(task.projectId);
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="text-red-600"
        onClick={() => setIsConfirmOpen(true)}
      >
        Delete task
      </Button>
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete this task?"
        confirmLabel="Delete task"
        isConfirming={deleteTask.isPending}
        onConfirm={() => {
          deleteTask.mutate(task.id);
          setIsConfirmOpen(false);
          onDeleted();
        }}
        onCancel={() => setIsConfirmOpen(false)}
      >
        &ldquo;{task.title}&rdquo; and its comments will be removed for everyone.
      </ConfirmDialog>
    </>
  );
}
