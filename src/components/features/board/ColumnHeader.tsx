"use client";

import { type FormEvent, useState } from "react";

import { Input } from "@/components/ui/Input";
import { useRenameColumn } from "@/hooks/useColumnMutations";
import type { ColumnDto } from "@/types/board";

import { ColumnMenu } from "./ColumnMenu";

interface ColumnHeaderProps {
  column: ColumnDto;
  taskCount: number;
  columnIndex: number;
  columnCount: number;
  canDelete: boolean;
}

export function ColumnHeader({ column, taskCount, ...menuProps }: ColumnHeaderProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [draftName, setDraftName] = useState(column.name);
  const renameColumn = useRenameColumn(column.projectId);

  function handleRename(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = draftName.trim();
    if (name && name !== column.name) renameColumn.mutate({ columnId: column.id, name });
    setIsRenaming(false);
  }

  if (isRenaming) {
    return (
      <form onSubmit={handleRename} className="px-1">
        <Input
          label="Column name"
          isLabelHidden
          value={draftName}
          onChange={(event) => setDraftName(event.target.value)}
          onBlur={() => setIsRenaming(false)}
          onKeyDown={(event) => event.key === "Escape" && setIsRenaming(false)}
          autoFocus
        />
      </form>
    );
  }
  return (
    <div className="flex items-center gap-2 px-1">
      <h2 className="truncate text-sm font-semibold text-neutral-800">{column.name}</h2>
      <span className="rounded-full bg-neutral-200 px-2 text-xs text-neutral-600">{taskCount}</span>
      <span className="ml-auto">
        <ColumnMenu
          column={column}
          {...menuProps}
          onRename={() => (setDraftName(column.name), setIsRenaming(true))}
        />
      </span>
    </div>
  );
}
