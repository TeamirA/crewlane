"use client";

import type { FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { createProjectSchema } from "@/core/application/schemas/projectSchemas";
import { useFormFields } from "@/hooks/useFormFields";
import { useRenameProject } from "@/hooks/useProjectDetails";
import type { ProjectDto } from "@/types/project";

export function RenameProjectForm({
  project,
  onDone,
}: {
  project: ProjectDto;
  onDone: () => void;
}) {
  const renameProject = useRenameProject(project.id);
  const { values, fieldErrors, handleChange, validate } = useFormFields(createProjectSchema, {
    name: project.name,
    description: project.description ?? "",
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = validate();
    if (input) renameProject.mutate(input, { onSuccess: onDone });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Input
        label="Project name"
        name="name"
        value={values.name}
        onChange={handleChange}
        error={fieldErrors.name}
      />
      <Textarea
        label="Description"
        name="description"
        value={values.description ?? ""}
        onChange={handleChange}
      />
      <Button type="submit" isLoading={renameProject.isPending} className="self-end">
        Save changes
      </Button>
    </form>
  );
}
