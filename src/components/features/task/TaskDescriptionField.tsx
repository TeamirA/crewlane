"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

interface TaskDescriptionFieldProps {
  description: string | null;
  isSaving: boolean;
  onSave: (description: string | null) => void;
}

export function TaskDescriptionField({ description, isSaving, onSave }: TaskDescriptionFieldProps) {
  const [draftDescription, setDraftDescription] = useState(description ?? "");
  const hasChanges = draftDescription !== (description ?? "");
  return (
    <div className="flex flex-col gap-2">
      <Textarea
        label="Description"
        isLabelHidden
        rows={5}
        placeholder="Add more detail about this task"
        value={draftDescription}
        onChange={(event) => setDraftDescription(event.target.value)}
      />
      {hasChanges && (
        <div className="flex gap-2">
          <Button
            size="sm"
            isLoading={isSaving}
            onClick={() => onSave(draftDescription.trim() || null)}
          >
            Save description
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDraftDescription(description ?? "")}>
            Discard
          </Button>
        </div>
      )}
    </div>
  );
}
