export const queryKeys = {
  currentUser: ["currentUser"] as const,
  projects: ["projects"] as const,
  project: (projectId: string) => ["projects", projectId] as const,
};
