import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "@/components/features/auth/LoginForm";

export const metadata: Metadata = { title: "Sign in · Crewlane" };

export default function LoginPage() {
  return (
    <>
      <h1 className="mb-6 text-xl font-semibold">Welcome back</h1>
      <Suspense>
        <LoginForm />
      </Suspense>
    </>
  );
}
