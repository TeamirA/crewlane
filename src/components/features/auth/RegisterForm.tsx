"use client";

import type { FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { registerSchema } from "@/core/application/schemas/authSchemas";
import { useRegister } from "@/hooks/useAuthMutations";
import { useFormFields } from "@/hooks/useFormFields";
import { ROUTES } from "@/lib/constants";

import { AuthSwitchLink } from "./AuthSwitchLink";
import { FormErrorMessage } from "./FormErrorMessage";

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
    if (input) register.mutate(input);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {registerFields.map((field) => (
        <Input
          key={field.name}
          {...field}
          value={values[field.name]}
          onChange={handleChange}
          error={fieldErrors[field.name]}
          hint={field.name === "password" ? "At least 8 characters" : undefined}
        />
      ))}
      <FormErrorMessage message={register.error?.message} />
      <Button type="submit" isLoading={register.isPending}>
        Create account
      </Button>
      <AuthSwitchLink prompt="Already have an account?" href={ROUTES.login} linkText="Sign in" />
    </form>
  );
}
