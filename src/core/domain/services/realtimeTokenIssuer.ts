export interface RealtimeToken {
  token: string;
  expiresAt: Date;
}

export interface RealtimeTokenIssuer {
  issueForUser(userId: string): Promise<RealtimeToken>;
}
