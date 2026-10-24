const MENTION_PATTERN = /(?:^|[^\w@])@([a-z0-9_]{3,30})\b/g;

export function extractMentionedUsernames(text: string): string[] {
  const usernames = Array.from(text.matchAll(MENTION_PATTERN), (match) => match[1]);
  return [...new Set(usernames)];
}
