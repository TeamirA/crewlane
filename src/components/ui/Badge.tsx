import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type BadgeTone = "neutral" | "indigo" | "green" | "amber" | "red";

interface BadgeProps {
  tone?: BadgeTone;
  color?: string;
  className?: string;
  children: ReactNode;
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-neutral-100 text-neutral-700",
  indigo: "bg-indigo-50 text-indigo-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-800",
  red: "bg-red-50 text-red-700",
};

// A custom hex color (used by task labels) overrides the tone.
export function Badge({ tone = "neutral", color, className, children }: BadgeProps) {
  return (
    <span
      style={color ? { backgroundColor: `${color}1f`, color } : undefined}
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        !color && toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
