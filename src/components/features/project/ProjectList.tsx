"use client";

import { EmptyState, ErrorState, LoadingState } from "@/components/ui/StatusMessage";
import { useProjects } from "@/hooks/useProjects";

import { ProjectCard } from "./ProjectCard";

export function ProjectList() {
  const { data: projects, isPending, error, refetch } = useProjects();
  if (isPending) {
    return <LoadingState label="Loading projects" />;
  }
  if (error) {
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  }
  if (projects.length === 0) {
    return (
      <EmptyState
        title="No projects yet"
        description="Create a project to start planning work with your team."
      />
    );
  }
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <li key={project.id}>
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  );
}
