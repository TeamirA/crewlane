import { type SelectHTMLAttributes, useId } from "react";

import { cn } from "@/lib/cn";

import { fieldControlClasses, FormField } from "./FormField";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  isLabelHidden?: boolean;
  containerClassName?: string;
}

export function Select(props: SelectProps) {
  const { label, options, isLabelHidden, containerClassName, className, id, ...rest } = props;
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <FormField
      fieldId={fieldId}
      label={label}
      isLabelHidden={isLabelHidden}
      className={containerClassName}
    >
      <select id={fieldId} className={cn(fieldControlClasses, "pr-8", className)} {...rest}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}
