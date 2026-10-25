import type { BoardEvent, UserEvent } from "@/core/domain/events/realtimeEvents";
import type { RealtimePublisher } from "@/core/domain/services/realtimePublisher";
import { toProjectTopic, toUserTopic } from "@/lib/realtimeTopics";

// Uses the Realtime REST broadcast endpoint, which suits short-lived serverless functions.
export class SupabaseRealtimePublisher implements RealtimePublisher {
  constructor(
    private readonly supabaseUrl: string,
    private readonly serviceRoleKey: string,
  ) {}

  publishToProject(projectId: string, event: BoardEvent) {
    return this.broadcast(toProjectTopic(projectId), event.name, event);
  }

  publishToUser(userId: string, event: UserEvent) {
    return this.broadcast(toUserTopic(userId), event.name, event);
  }

  private async broadcast(topic: string, eventName: string, payload: object) {
    try {
      const response = await fetch(`${this.supabaseUrl}/realtime/v1/api/broadcast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: this.serviceRoleKey,
          Authorization: `Bearer ${this.serviceRoleKey}`,
        },
        body: JSON.stringify({ messages: [{ topic, event: eventName, payload, private: true }] }),
      });
      if (!response.ok) {
        console.error("Realtime broadcast rejected", response.status, await response.text());
      }
    } catch (error) {
      // Live updates are best-effort; the data is already saved, so never fail the request.
      console.error("Realtime broadcast failed", error);
    }
  }
}
