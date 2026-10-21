"use client";

import { useProjects } from "@/hooks/useProjects";

import { ProjectCard } from "./ProjectCard";

export function ProjectList() {
  const { data: projects, isPending, error } = useProjects();
  if (isPending) {
    return <p className="text-neutral-500">Loading projects…</p>;
  }
  if (error) {
    return <p role="alert">Could not load projects: {error.message}</p>;
  }
  if (projects.length === 0) {
    return <p className="text-neutral-500">No projects yet. Create your first one.</p>;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
