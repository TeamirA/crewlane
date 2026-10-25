import { Fragment } from "react";

const MENTION_TOKEN = /(@[a-z0-9_]{3,30})/g;

export function MentionText({
  text,
  memberUsernames,
}: {
  text: string;
  memberUsernames: Set<string>;
}) {
  return (
    <p className="text-sm break-words whitespace-pre-wrap text-neutral-800">
      {text.split(MENTION_TOKEN).map((part, index) =>
        part.startsWith("@") && memberUsernames.has(part.slice(1)) ? (
          <span key={index} className="rounded bg-indigo-50 px-0.5 font-medium text-indigo-700">
            {part}
          </span>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </p>
  );
}
