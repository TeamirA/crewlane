"use client";

import { Button } from "@/components/ui/Button";
import { useDeleteProject } from "@/hooks/useProjectDetails";
import type { ProjectDto } from "@/types/project";

interface DeleteProjectConfirmationProps {
  project: ProjectDto;
  onCancel: () => void;
}

export function DeleteProjectConfirmation({ project, onCancel }: DeleteProjectConfirmationProps) {
  const deleteProject = useDeleteProject(project.id);
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-neutral-700">
        This permanently deletes <strong>{project.name}</strong> with all of its columns, tasks, and
        comments. This cannot be undone.
      </p>
      {deleteProject.error && (
        <p role="alert" className="text-sm text-red-600">
          {deleteProject.error.message}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="danger"
          isLoading={deleteProject.isPending}
          onClick={() => deleteProject.mutate()}
        >
          Delete project
        </Button>
      </div>
    </div>
  );
}
