import type { Prisma } from "@prisma/client";

export const userSummarySelect = {
  id: true,
  username: true,
  displayName: true,
} satisfies Prisma.UserSelect;

export const userSelect = {
  ...userSummarySelect,
  email: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export const taskInclude = {
  assignees: { include: { user: { select: userSummarySelect } }, orderBy: { assignedAt: "asc" } },
  labels: { include: { label: true } },
  _count: { select: { comments: true } },
} satisfies Prisma.TaskInclude;

export const memberInclude = {
  user: { select: userSummarySelect },
} satisfies Prisma.ProjectMemberInclude;

export const commentInclude = {
  author: { select: userSummarySelect },
} satisfies Prisma.CommentInclude;

export const notificationInclude = {
  actor: { select: userSummarySelect },
  task: { select: { title: true } },
} satisfies Prisma.NotificationInclude;
