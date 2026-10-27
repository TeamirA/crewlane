"use client";

import { ErrorState } from "@/components/ui/StatusMessage";

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <ErrorState message={error.message || "Unexpected error"} onRetry={reset} />
    </main>
  );
}
