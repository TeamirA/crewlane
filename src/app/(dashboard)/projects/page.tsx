import type { Metadata } from "next";

import { CreateProjectForm } from "@/components/features/project/CreateProjectForm";
import { ProjectList } from "@/components/features/project/ProjectList";

export const metadata: Metadata = { title: "Projects · Crewlane" };

export default function ProjectsPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-semibold">Your projects</h1>
      <CreateProjectForm />
      <ProjectList />
    </main>
  );
}
