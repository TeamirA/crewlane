"use client";

import { useSearchParams } from "next/navigation";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loginSchema } from "@/core/application/schemas/authSchemas";
import { useLogin } from "@/hooks/useAuthMutations";
import { useFormFields } from "@/hooks/useFormFields";
import { ROUTES } from "@/lib/constants";
import { getSafeRedirectPath } from "@/lib/getSafeRedirectPath";

import { AuthSwitchLink } from "./AuthSwitchLink";
import { FormErrorMessage } from "./FormErrorMessage";

export function LoginForm() {
  const redirectPath = getSafeRedirectPath(useSearchParams().get("next"));
  const login = useLogin(redirectPath);
  const { values, fieldErrors, handleChange, validate } = useFormFields(loginSchema, {
    email: "",
    password: "",
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = validate();
    if (input) login.mutate(input);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={handleChange}
        error={fieldErrors.email}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        value={values.password}
        onChange={handleChange}
        error={fieldErrors.password}
      />
      <FormErrorMessage message={login.error?.message} />
      <Button type="submit" isLoading={login.isPending}>
        Sign in
      </Button>
      <AuthSwitchLink
        prompt="New to Crewlane?"
        href={ROUTES.register}
        linkText="Create an account"
      />
    </form>
  );
}
