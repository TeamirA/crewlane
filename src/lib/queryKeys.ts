export const queryKeys = {
  currentUser: ["currentUser"] as const,
  projects: ["projects"] as const,
  notifications: ["notifications"] as const,
  project: (projectId: string) => ["projects", projectId] as const,
  board: (projectId: string) => ["projects", projectId, "board"] as const,
  task: (taskId: string) => ["tasks", taskId] as const,
  taskComments: (taskId: string) => ["tasks", taskId, "comments"] as const,
  taskActivity: (taskId: string) => ["tasks", taskId, "activity"] as const,
};
