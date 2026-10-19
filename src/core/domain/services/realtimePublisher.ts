import type { BoardEvent, UserEvent } from "../events/realtimeEvents";

export interface RealtimePublisher {
  publishToProject(projectId: string, event: BoardEvent): Promise<void>;
  publishToUser(userId: string, event: UserEvent): Promise<void>;
}
