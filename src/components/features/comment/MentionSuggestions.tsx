import { Avatar } from "@/components/ui/Avatar";
import type { UserSummaryDto } from "@/types/user";

const TRAILING_MENTION = /(?:^|\s)@([a-z0-9_]*)$/;

export function getMentionQuery(text: string): string | null {
  return TRAILING_MENTION.exec(text)?.[1] ?? null;
}

export function insertMention(text: string, username: string): string {
  return text.replace(/@([a-z0-9_]*)$/, `@${username} `);
}

interface MentionSuggestionsProps {
  query: string;
  members: UserSummaryDto[];
  onSelect: (username: string) => void;
}

export function MentionSuggestions({ query, members, onSelect }: MentionSuggestionsProps) {
  const matches = members
    .filter((member) => member.username.startsWith(query.toLowerCase()))
    .slice(0, 5);
  if (matches.length === 0) return null;
  return (
    <ul aria-label="Mention suggestions" className="rounded-md border bg-white py-1 shadow-sm">
      {matches.map((member) => (
        <li key={member.id}>
          <button
            type="button"
            onClick={() => onSelect(member.username)}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-neutral-100"
          >
            <Avatar name={member.displayName} seed={member.id} size="xs" />
            {member.displayName}
            <span className="text-neutral-500">@{member.username}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
