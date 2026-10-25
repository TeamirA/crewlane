export function toProjectTopic(projectId: string): string {
  return `project:${projectId}`;
}

export function toUserTopic(userId: string): string {
  return `user:${userId}`;
}
