import Link from "next/link";

import { APP_NAME, ROUTES } from "@/lib/constants";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="flex flex-1 items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href={ROUTES.home} className="mb-8 block text-center text-2xl font-bold">
          {APP_NAME}
        </Link>
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          {children}
        </div>
      </div>
    </main>
  );
}
