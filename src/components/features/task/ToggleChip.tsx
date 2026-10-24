import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface ToggleChipProps {
  isSelected: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function ToggleChip({ isSelected, onToggle, children }: ToggleChipProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onToggle}
      className={cn(
        "flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-sm",
        isSelected ? "border-indigo-300 bg-indigo-50" : "bg-white hover:bg-neutral-50",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid size-4 place-items-center rounded border text-[10px]",
          isSelected ? "border-indigo-600 bg-indigo-600 text-white" : "border-neutral-300",
        )}
      >
        {isSelected && "✓"}
      </span>
      {children}
    </button>
  );
}
