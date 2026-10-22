"use client";

import type { FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { createProjectSchema } from "@/core/application/schemas/projectSchemas";
import { useFormFields } from "@/hooks/useFormFields";
import { useCreateProject } from "@/hooks/useProjects";

const emptyProject = { name: "", description: "" };

export function CreateProjectForm({ onCreated }: { onCreated: () => void }) {
  const createProject = useCreateProject();
  const { values, setValues, fieldErrors, handleChange, validate } = useFormFields(
    createProjectSchema,
    emptyProject,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = validate();
    if (!input) return;
    createProject.mutate(input, {
      onSuccess: () => {
        setValues(emptyProject);
        onCreated();
      },
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Input
        label="Project name"
        name="name"
        value={values.name}
        onChange={handleChange}
        error={fieldErrors.name}
        autoFocus
      />
      <Textarea
        label="Description"
        name="description"
        value={values.description ?? ""}
        onChange={handleChange}
        error={fieldErrors.description}
        hint="Optional"
      />
      {createProject.error && (
        <p role="alert" className="text-sm text-red-600">
          {createProject.error.message}
        </p>
      )}
      <Button type="submit" isLoading={createProject.isPending} className="self-end">
        Create project
      </Button>
    </form>
  );
}
