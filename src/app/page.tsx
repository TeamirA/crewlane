import Link from "next/link";

import { APP_NAME, ROUTES } from "@/lib/constants";

const linkBaseClasses = "inline-flex h-11 items-center rounded-md px-5 text-sm font-medium";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-neutral-50 p-8 text-center">
      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
        Real-time Kanban for teams
      </span>
      <h1 className="text-5xl font-bold tracking-tight">{APP_NAME}</h1>
      <p className="max-w-md text-lg text-neutral-600">
        Plan, assign, and ship work together on shared boards that update the moment a teammate
        moves a card.
      </p>
      <div className="flex gap-3">
        <Link
          href={ROUTES.register}
          className={`${linkBaseClasses} bg-indigo-600 text-white hover:bg-indigo-500`}
        >
          Get started
        </Link>
        <Link
          href={ROUTES.login}
          className={`${linkBaseClasses} border bg-white hover:bg-neutral-100`}
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
