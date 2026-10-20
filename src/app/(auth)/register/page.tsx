import type { Metadata } from "next";

import { RegisterForm } from "@/components/features/auth/RegisterForm";

export const metadata: Metadata = { title: "Create account · Crewlane" };

export default function RegisterPage() {
  return (
    <>
      <h1 className="mb-6 text-xl font-semibold">Create your account</h1>
      <RegisterForm />
    </>
  );
}
