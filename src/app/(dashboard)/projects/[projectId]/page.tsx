import type { Metadata } from "next";
import { Suspense } from "react";

import { ProjectWorkspace } from "@/components/features/project/ProjectWorkspace";

export const metadata: Metadata = { title: "Board · Crewlane" };

export default async function ProjectPage({
  params,
  searchParams,
}: PageProps<"/projects/[projectId]">) {
  const [{ projectId }, { task }] = await Promise.all([params, searchParams]);
  // Keying on the linked task reopens the detail modal when a notification is followed.
  return (
    <Suspense>
      <ProjectWorkspace key={`${projectId}:${String(task ?? "")}`} projectId={projectId} />
    </Suspense>
  );
}
