"use client";

import Link from "next/link";
import type { FormEvent } from "react";

import { registerSchema } from "@/core/application/schemas/authSchemas";
import { useRegister } from "@/hooks/useAuthMutations";
import { useFormFields } from "@/hooks/useFormFields";
import { ROUTES } from "@/lib/constants";

const registerFields = [
  { name: "displayName", label: "Full name", type: "text", autoComplete: "name" },
  { name: "username", label: "Username", type: "text", autoComplete: "username" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "password", label: "Password", type: "password", autoComplete: "new-password" },
] as const;

export function RegisterForm() {
  const register = useRegister();
  const { values, fieldErrors, handleChange, validate } = useFormFields(registerSchema, {
    displayName: "",
    username: "",
    email: "",
    password: "",
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = validate();
    if (input) {
      register.mutate(input);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {registerFields.map((field) => (
        <label key={field.name} className="flex flex-col gap-1 text-sm font-medium">
          {field.label}
          <input
            {...field}
            value={values[field.name]}
            onChange={handleChange}
            className="rounded-md border px-3 py-2"
          />
          {fieldErrors[field.name] && (
            <span className="text-red-600">{fieldErrors[field.name]}</span>
          )}
        </label>
      ))}
      {register.error && (
        <p role="alert" className="text-sm text-red-600">
          {register.error.message}
        </p>
      )}
      <button
        type="submit"
        disabled={register.isPending}
        className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white"
      >
        {register.isPending ? "Creating account…" : "Create account"}
      </button>
      <p className="text-center text-sm text-neutral-600">
        Already have an account? <Link href={ROUTES.login}>Sign in</Link>
      </p>
    </form>
  );
}
