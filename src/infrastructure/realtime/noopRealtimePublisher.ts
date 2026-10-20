import type { RealtimePublisher } from "@/core/domain/services/realtimePublisher";

export class NoopRealtimePublisher implements RealtimePublisher {
  async publishToProject() {}

  async publishToUser() {}
}
