import Link from "next/link";

import { APP_NAME, ROUTES } from "@/lib/constants";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-5xl font-bold tracking-tight">{APP_NAME}</h1>
      <p className="max-w-md text-lg text-neutral-600">
        Plan, assign, and ship work together on shared Kanban boards that update in real time.
      </p>
      <div className="flex gap-3">
        <Link
          href={ROUTES.register}
          className="rounded-md bg-indigo-600 px-5 py-2.5 font-medium text-white"
        >
          Get started
        </Link>
        <Link href={ROUTES.login} className="rounded-md border px-5 py-2.5 font-medium">
          Sign in
        </Link>
      </div>
    </main>
  );
}
