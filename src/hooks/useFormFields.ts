"use client";

import { type ChangeEvent, useState } from "react";
import type { z } from "zod";

export type FieldErrors<TValues> = Partial<Record<keyof TValues, string>>;

export function useFormFields<TSchema extends z.ZodObject>(
  schema: TSchema,
  initialValues: z.input<TSchema>,
) {
  type Values = z.input<TSchema>;
  const [values, setValues] = useState<Values>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<Values>>({});

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
  }

  function validate(): z.output<TSchema> | null {
    const result = schema.safeParse(values);
    if (result.success) {
      return result.data;
    }
    const errors: FieldErrors<Values> = {};
    for (const issue of result.error.issues) {
      const fieldName = issue.path[0] as keyof Values;
      errors[fieldName] ??= issue.message;
    }
    setFieldErrors(errors);
    return null;
  }

  return { values, setValues, fieldErrors, handleChange, validate };
}
