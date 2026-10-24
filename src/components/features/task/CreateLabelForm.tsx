"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCreateLabel } from "@/hooks/useCreateLabel";
import { cn } from "@/lib/cn";

const LABEL_COLORS = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

export function CreateLabelForm({ projectId }: { projectId: string }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(LABEL_COLORS[0]);
  const createLabel = useCreateLabel(projectId);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (name.trim())
      createLabel.mutate({ name: name.trim(), color }, { onSuccess: () => setName("") });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-1 flex flex-col gap-2">
      <Input
        label="New label name"
        isLabelHidden
        placeholder="New label"
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={createLabel.error?.message}
      />
      <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Label color">
        {LABEL_COLORS.map((labelColor) => (
          <button
            key={labelColor}
            type="button"
            role="radio"
            aria-checked={color === labelColor}
            aria-label={`Color ${labelColor}`}
            onClick={() => setColor(labelColor)}
            style={{ backgroundColor: labelColor }}
            className={cn("size-5 rounded-full", color === labelColor && "ring-2 ring-offset-2")}
          />
        ))}
        <Button type="submit" variant="secondary" size="sm" className="ml-auto">
          Add
        </Button>
      </div>
    </form>
  );
}
