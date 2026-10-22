"use client";

import { ErrorState, LoadingState } from "@/components/ui/StatusMessage";
import { useProjectDetails } from "@/hooks/useProjectDetails";

import { ProjectHeader } from "./ProjectHeader";

export function ProjectWorkspace({ projectId }: { projectId: string }) {
  const { data: details, isPending, error, refetch } = useProjectDetails(projectId);
  if (isPending) {
    return <LoadingState label="Loading project" />;
  }
  if (error) {
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  }
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-5">
      <ProjectHeader details={details} />
    </div>
  );
}
