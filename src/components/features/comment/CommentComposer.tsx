"use client";

import { type FormEvent, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import type { UserSummaryDto } from "@/types/user";

import { getMentionQuery, insertMention, MentionSuggestions } from "./MentionSuggestions";

interface CommentComposerProps {
  members: UserSummaryDto[];
  initialBody?: string;
  submitLabel: string;
  isSubmitting: boolean;
  errorMessage?: string;
  onSubmit: (body: string, resetComposer: () => void) => void;
  onCancel?: () => void;
}

export function CommentComposer(props: CommentComposerProps) {
  const { members, initialBody = "", submitLabel, isSubmitting, errorMessage } = props;
  const [body, setBody] = useState(initialBody);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mentionQuery = getMentionQuery(body);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (body.trim()) props.onSubmit(body.trim(), () => setBody(""));
  }

  // Keyboard selection moves focus to the suggestion; return the caret to the end of the text.
  function handleMentionSelect(username: string) {
    const nextBody = insertMention(body, username);
    setBody(nextBody);
    requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      if (!textarea || document.activeElement === textarea) return;
      textarea.focus();
      textarea.setSelectionRange(nextBody.length, nextBody.length);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Textarea
        ref={textareaRef}
        label={submitLabel}
        isLabelHidden
        rows={2}
        placeholder="Write a comment… use @username to mention a teammate"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        error={errorMessage}
      />
      {mentionQuery !== null && (
        <MentionSuggestions query={mentionQuery} members={members} onSelect={handleMentionSelect} />
      )}
      <div className="flex gap-2">
        <Button type="submit" size="sm" isLoading={isSubmitting} disabled={!body.trim()}>
          {submitLabel}
        </Button>
        {props.onCancel && (
          <Button variant="ghost" size="sm" onClick={props.onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
