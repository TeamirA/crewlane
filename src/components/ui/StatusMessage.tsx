import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import { Button } from "./Button";
import { Spinner } from "./Spinner";

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex flex-1 items-center justify-center gap-3 py-16 text-neutral-500">
      <Spinner label={label} />
      <span>{label}…</span>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-xl border border-dashed p-10 text-center",
        className,
      )}
    >
      <p className="font-medium text-neutral-800">{title}</p>
      {description && <p className="max-w-sm text-sm text-neutral-500">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 py-12 text-center">
      <p className="font-medium text-red-700">Something went wrong</p>
      <p className="text-sm text-neutral-600">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
