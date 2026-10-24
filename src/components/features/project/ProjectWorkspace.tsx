"use client";

import { useState } from "react";

import { Board } from "@/components/features/board/Board";
import { BoardToolbar } from "@/components/features/board/BoardToolbar";
import { TaskDetailModal } from "@/components/features/task/TaskDetailModal";
import { ErrorState, LoadingState } from "@/components/ui/StatusMessage";
import { useBoard } from "@/hooks/useBoard";
import { useBoardFilters } from "@/hooks/useBoardFilters";
import { useProjectDetails } from "@/hooks/useProjectDetails";
import { doesTaskMatchFilters } from "@/lib/taskFilters";

import { ProjectHeader } from "./ProjectHeader";

export function ProjectWorkspace({ projectId }: { projectId: string }) {
  const projectQuery = useProjectDetails(projectId);
  const boardQuery = useBoard(projectId);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const { filters, updateFilter, clearFilters } = useBoardFilters();
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
  const members = projectQuery.data.members.map((member) => member.user);
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-5">
      <ProjectHeader details={projectQuery.data} />
      <BoardToolbar
        filters={filters}
        members={members}
        labels={board.labels}
        onFilterChange={updateFilter}
        onClear={clearFilters}
      />
      <Board
        projectId={projectId}
        board={board}
        currentUserRole={projectQuery.data.currentUserRole}
        isTaskVisible={(task) => doesTaskMatchFilters(task, filters)}
        onOpenTask={setOpenTaskId}
      />
      {openTask && (
        <TaskDetailModal
          task={openTask}
          columnName={openTaskColumn?.name ?? ""}
          members={members}
          labels={board.labels}
          onClose={() => setOpenTaskId(null)}
        />
      )}
    </div>
  );
}
