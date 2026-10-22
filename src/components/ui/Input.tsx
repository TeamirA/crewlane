import { type InputHTMLAttributes, useId } from "react";

import { cn } from "@/lib/cn";

import { fieldControlClasses, FormField, getFieldDescriptionId } from "./FormField";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  isLabelHidden?: boolean;
  containerClassName?: string;
}

export function Input(props: InputProps) {
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
      <input
        id={fieldId}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={getFieldDescriptionId(fieldId, error, hint)}
        className={cn(fieldControlClasses, className)}
        {...rest}
      />
    </FormField>
  );
}
