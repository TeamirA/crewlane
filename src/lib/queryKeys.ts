export const queryKeys = {
  currentUser: ["currentUser"] as const,
  projects: ["projects"] as const,
  project: (projectId: string) => ["projects", projectId] as const,
  board: (projectId: string) => ["projects", projectId, "board"] as const,
  task: (taskId: string) => ["tasks", taskId] as const,
};
