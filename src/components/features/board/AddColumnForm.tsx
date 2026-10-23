"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCreateColumn } from "@/hooks/useColumnMutations";

export function AddColumnForm({ projectId }: { projectId: string }) {
  const [name, setName] = useState("");
  const createColumn = useCreateColumn(projectId);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;
    createColumn.mutate(name.trim(), { onSuccess: () => setName("") });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-72 shrink-0 flex-col gap-2 self-start rounded-xl border border-dashed bg-white/60 p-3"
    >
      <Input
        label="New column name"
        isLabelHidden
        placeholder="Add another column"
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={createColumn.error?.message}
      />
      <Button type="submit" variant="secondary" size="sm" isLoading={createColumn.isPending}>
        Add column
      </Button>
    </form>
  );
}
