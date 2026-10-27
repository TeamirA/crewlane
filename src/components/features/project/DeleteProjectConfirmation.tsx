"use client";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useDeleteProject } from "@/hooks/useProjectDetails";
import type { ProjectDto } from "@/types/project";

interface DeleteProjectConfirmationProps {
  project: ProjectDto;
  isOpen: boolean;
  onCancel: () => void;
}

export function DeleteProjectConfirmation(props: DeleteProjectConfirmationProps) {
  const { project, isOpen, onCancel } = props;
  const deleteProject = useDeleteProject(project.id);
  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Delete project?"
      confirmLabel="Delete project"
      isConfirming={deleteProject.isPending}
      errorMessage={deleteProject.error?.message}
      onConfirm={() => deleteProject.mutate()}
      onCancel={onCancel}
    >
      This permanently deletes <strong>{project.name}</strong> with all of its columns, tasks, and
      comments. This cannot be undone.
    </ConfirmDialog>
  );
}
