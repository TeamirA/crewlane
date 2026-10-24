import { type ReactNode, useId } from "react";

export function TaskDetailSection({ title, children }: { title: string; children: ReactNode }) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <h3 id={headingId} className="text-sm font-semibold text-neutral-800">
        {title}
      </h3>
      {children}
    </section>
  );
}
