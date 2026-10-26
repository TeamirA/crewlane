import Link from "next/link";

import { APP_NAME, ROUTES } from "@/lib/constants";

import { NotificationBell } from "../notification/NotificationBell";

import { UserMenu } from "./UserMenu";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center gap-6 px-4">
        <Link href={ROUTES.projects} className="flex items-center gap-2 font-bold">
          <span
            aria-hidden="true"
            className="grid size-7 place-items-center rounded-md bg-indigo-600 text-sm text-white"
          >
            C
          </span>
          {APP_NAME}
        </Link>
        <nav aria-label="Main" className="text-sm">
          <Link href={ROUTES.projects} className="text-neutral-600 hover:text-neutral-900">
            Projects
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <NotificationBell />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
