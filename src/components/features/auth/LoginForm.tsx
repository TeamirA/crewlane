"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { FormEvent } from "react";

import { loginSchema } from "@/core/application/schemas/authSchemas";
import { useLogin } from "@/hooks/useAuthMutations";
import { useFormFields } from "@/hooks/useFormFields";
import { ROUTES } from "@/lib/constants";
import { getSafeRedirectPath } from "@/lib/getSafeRedirectPath";

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
    if (input) {
      login.mutate(input);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm font-medium">
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          className="rounded-md border px-3 py-2"
        />
        {fieldErrors.email && <span className="text-red-600">{fieldErrors.email}</span>}
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange}
          className="rounded-md border px-3 py-2"
        />
        {fieldErrors.password && <span className="text-red-600">{fieldErrors.password}</span>}
      </label>
      {login.error && (
        <p role="alert" className="text-sm text-red-600">
          {login.error.message}
        </p>
      )}
      <button
        type="submit"
        disabled={login.isPending}
        className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white"
      >
        {login.isPending ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-center text-sm text-neutral-600">
        New to Crewlane? <Link href={ROUTES.register}>Create an account</Link>
      </p>
    </form>
  );
}
