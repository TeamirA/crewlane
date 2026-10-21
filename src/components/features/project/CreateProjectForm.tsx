"use client";

import type { FormEvent } from "react";

import { createProjectSchema } from "@/core/application/schemas/projectSchemas";
import { useFormFields } from "@/hooks/useFormFields";
import { useCreateProject } from "@/hooks/useProjects";

export function CreateProjectForm() {
  const createProject = useCreateProject();
  const { values, setValues, fieldErrors, handleChange, validate } = useFormFields(
    createProjectSchema,
    { name: "", description: "" },
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = validate();
    if (input) {
      createProject.mutate(input, { onSuccess: () => setValues({ name: "", description: "" }) });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <label className="flex flex-1 flex-col gap-1 text-sm">
        <span className="sr-only">Project name</span>
        <input
          name="name"
          placeholder="New project name"
          value={values.name}
          onChange={handleChange}
          className="rounded-md border px-3 py-2"
        />
        {fieldErrors.name && <span className="text-red-600">{fieldErrors.name}</span>}
      </label>
      <button
        type="submit"
        disabled={createProject.isPending}
        className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white"
      >
        Create project
      </button>
    </form>
  );
}
