import type { Metadata } from "next";

import { ProjectList } from "@/components/features/project/ProjectList";
import { ProjectsHeader } from "@/components/features/project/ProjectsHeader";

export const metadata: Metadata = { title: "Projects · Crewlane" };

export default function ProjectsPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <ProjectsHeader />
      <ProjectList />
    </main>
  );
}
