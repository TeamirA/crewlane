"use client";

import { useState } from "react";

import { Board } from "@/components/features/board/Board";
import { TaskDetailModal } from "@/components/features/task/TaskDetailModal";
import { ErrorState, LoadingState } from "@/components/ui/StatusMessage";
import { useBoard } from "@/hooks/useBoard";
import { useProjectDetails } from "@/hooks/useProjectDetails";

import { ProjectHeader } from "./ProjectHeader";

export function ProjectWorkspace({ projectId }: { projectId: string }) {
  const projectQuery = useProjectDetails(projectId);
  const boardQuery = useBoard(projectId);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const error = projectQuery.error ?? boardQuery.error;
  if (error) {
    const retry = () => (projectQuery.refetch(), boardQuery.refetch());
    return <ErrorState message={error.message} onRetry={retry} />;
  }
  if (!projectQuery.data || !boardQuery.data) {
    return <LoadingState label="Loading board" />;
  }
  const board = boardQuery.data;
  const openTask = board.tasks.find((task) => task.id === openTaskId);
  const openTaskColumn = board.columns.find((column) => column.id === openTask?.columnId);
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-5">
      <ProjectHeader details={projectQuery.data} />
      <Board
        projectId={projectId}
        board={board}
        currentUserRole={projectQuery.data.currentUserRole}
        onOpenTask={setOpenTaskId}
      />
      {openTask && (
        <TaskDetailModal
          task={openTask}
          columnName={openTaskColumn?.name ?? ""}
          members={projectQuery.data.members.map((member) => member.user)}
          labels={board.labels}
          onClose={() => setOpenTaskId(null)}
        />
      )}
    </div>
  );
}
