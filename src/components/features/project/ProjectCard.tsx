import Link from "next/link";

import type { ProjectSummaryDto } from "@/types/project";

export function ProjectCard({ project }: { project: ProjectSummaryDto }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="flex flex-col gap-2 rounded-xl border bg-white p-5 shadow-sm hover:border-indigo-300"
    >
      <h2 className="font-semibold">{project.name}</h2>
      {project.description && (
        <p className="line-clamp-2 text-sm text-neutral-600">{project.description}</p>
      )}
      <p className="mt-auto text-xs text-neutral-500">
        {project.memberCount} members · {project.taskCount} tasks · {project.currentUserRole}
      </p>
    </Link>
  );
}
