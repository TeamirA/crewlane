"use client";

import { useState } from "react";

import { Input } from "@/components/ui/Input";

interface TaskTitleFieldProps {
  title: string;
  onSave: (title: string) => void;
}

export function TaskTitleField({ title, onSave }: TaskTitleFieldProps) {
  const [draftTitle, setDraftTitle] = useState(title);

  function saveIfChanged() {
    const trimmedTitle = draftTitle.trim();
    if (!trimmedTitle) {
      setDraftTitle(title);
    } else if (trimmedTitle !== title) {
      onSave(trimmedTitle);
    }
  }

  return (
    <Input
      label="Task title"
      isLabelHidden
      value={draftTitle}
      onChange={(event) => setDraftTitle(event.target.value)}
      onBlur={saveIfChanged}
      onKeyDown={(event) => event.key === "Enter" && event.currentTarget.blur()}
      className="border-transparent px-2 text-lg font-semibold hover:border-neutral-300"
    />
  );
}
