import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { formatRole } from "@/lib/formatting";
import type { ProjectSummaryDto } from "@/types/project";

export function ProjectCard({ project }: { project: ProjectSummaryDto }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group flex min-h-36 flex-col gap-2 rounded-xl border bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-semibold group-hover:text-indigo-700">{project.name}</h2>
        <Badge tone={project.currentUserRole === "OWNER" ? "indigo" : "neutral"}>
          {formatRole(project.currentUserRole)}
        </Badge>
      </div>
      {project.description && (
        <p className="line-clamp-2 text-sm text-neutral-600">{project.description}</p>
      )}
      <p className="mt-auto text-xs text-neutral-500">
        {project.memberCount} {project.memberCount === 1 ? "member" : "members"} ·{" "}
        {project.taskCount} {project.taskCount === 1 ? "task" : "tasks"}
      </p>
    </Link>
  );
}
