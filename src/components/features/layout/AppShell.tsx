import type { ReactNode } from "react";

import { AppHeader } from "./AppHeader";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-neutral-50">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-white px-3 py-2 focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <AppHeader />
      <div id="main-content" className="flex flex-1 flex-col">
        {children}
      </div>
    </div>
  );
}
