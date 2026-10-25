export interface RealtimeMessage<TPayload = Record<string, unknown>> {
  name: string;
  actorId?: string;
  payload: TPayload;
}
