"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCreateTask } from "@/hooks/useTaskMutations";

export function AddTaskForm({ projectId, columnId }: { projectId: string; columnId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const createTask = useCreateTask(projectId);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;
    createTask.mutate({ columnId, title: title.trim() }, { onSuccess: () => setTitle("") });
  }

  if (!isOpen) {
    return (
      <Button variant="ghost" size="sm" className="justify-start" onClick={() => setIsOpen(true)}>
        + Add task
      </Button>
    );
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Input
        label="Task title"
        isLabelHidden
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={(event) => event.key === "Escape" && setIsOpen(false)}
        error={createTask.error?.message}
        autoFocus
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" isLoading={createTask.isPending}>
          Add
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
