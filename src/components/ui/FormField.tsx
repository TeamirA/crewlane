import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface FormFieldProps {
  fieldId: string;
  label: string;
  error?: string;
  hint?: string;
  isLabelHidden?: boolean;
  className?: string;
  children: ReactNode;
}

export function getFieldDescriptionId(fieldId: string, error?: string, hint?: string) {
  if (error) return `${fieldId}-error`;
  if (hint) return `${fieldId}-hint`;
  return undefined;
}

export function FormField(props: FormFieldProps) {
  const { fieldId, label, error, hint, isLabelHidden, className, children } = props;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={fieldId}
        className={cn("text-sm font-medium text-neutral-800", isLabelHidden && "sr-only")}
      >
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${fieldId}-error`} className="text-sm text-red-600">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${fieldId}-hint`} className="text-sm text-neutral-500">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export const fieldControlClasses =
  "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 " +
  "placeholder:text-neutral-400 focus:border-indigo-500 focus:outline-none " +
  "aria-invalid:border-red-500 disabled:bg-neutral-100";
