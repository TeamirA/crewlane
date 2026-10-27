import Link from "next/link";

import { ROUTES } from "@/lib/constants";

export default function NotFoundPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <p className="text-sm font-semibold text-indigo-600">404</p>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-neutral-600">The page you are looking for does not exist.</p>
      <Link href={ROUTES.projects} className="font-medium text-indigo-600 hover:underline">
        Back to your projects
      </Link>
    </main>
  );
}
