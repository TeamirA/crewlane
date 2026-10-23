"use client";

import { useState } from "react";

import { Board } from "@/components/features/board/Board";
import { ErrorState, LoadingState } from "@/components/ui/StatusMessage";
import { useBoard } from "@/hooks/useBoard";
import { useProjectDetails } from "@/hooks/useProjectDetails";

import { ProjectHeader } from "./ProjectHeader";

export function ProjectWorkspace({ projectId }: { projectId: string }) {
  const projectQuery = useProjectDetails(projectId);
  const boardQuery = useBoard(projectId);
  const [, setOpenTaskId] = useState<string | null>(null);
  const error = projectQuery.error ?? boardQuery.error;
  if (error) {
    const retry = () => (projectQuery.refetch(), boardQuery.refetch());
    return <ErrorState message={error.message} onRetry={retry} />;
  }
  if (!projectQuery.data || !boardQuery.data) {
    return <LoadingState label="Loading board" />;
  }
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-5">
      <ProjectHeader details={projectQuery.data} />
      <Board
        projectId={projectId}
        board={boardQuery.data}
        currentUserRole={projectQuery.data.currentUserRole}
        onOpenTask={setOpenTaskId}
      />
    </div>
  );
}
