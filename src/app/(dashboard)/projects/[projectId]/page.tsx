import type { Metadata } from "next";

import { ProjectWorkspace } from "@/components/features/project/ProjectWorkspace";

export const metadata: Metadata = { title: "Board · Crewlane" };

export default async function ProjectPage({ params }: PageProps<"/projects/[projectId]">) {
  const { projectId } = await params;
  return <ProjectWorkspace projectId={projectId} />;
}
