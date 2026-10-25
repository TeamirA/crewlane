import type { RealtimeToken } from "../../../domain/services/realtimeTokenIssuer";
import type { AppDependencies } from "../../ports";

// Channel access itself is enforced by database policies that check project membership.
export function issueRealtimeToken(
  { realtimeTokens }: Pick<AppDependencies, "realtimeTokens">,
  actorId: string,
): Promise<RealtimeToken> {
  return realtimeTokens.issueForUser(actorId);
}
