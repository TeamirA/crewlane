import { type TextareaHTMLAttributes, useId } from "react";

import { cn } from "@/lib/cn";

import { fieldControlClasses, FormField, getFieldDescriptionId } from "./FormField";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  isLabelHidden?: boolean;
  containerClassName?: string;
}

export function Textarea(props: TextareaProps) {
  const { label, error, hint, isLabelHidden, containerClassName, className, id, ...rest } = props;
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <FormField
      fieldId={fieldId}
      label={label}
      error={error}
      hint={hint}
      isLabelHidden={isLabelHidden}
      className={containerClassName}
    >
      <textarea
        id={fieldId}
        rows={3}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={getFieldDescriptionId(fieldId, error, hint)}
        className={cn(fieldControlClasses, "resize-y", className)}
        {...rest}
      />
    </FormField>
  );
}
