import { describe, expect, it } from "vitest";

import { extractMentionedUsernames } from "@/core/domain/services/mentions";

describe("extractMentionedUsernames", () => {
  it("finds every distinct @username in a comment", () => {
    expect(extractMentionedUsernames("@amara can you pair with @dawit? cc @amara")).toEqual([
      "amara",
      "dawit",
    ]);
  });

  it("ignores email addresses and too-short handles", () => {
    expect(extractMentionedUsernames("mail lena@crewlane.dev or ping @ab")).toEqual([]);
  });

  it("accepts mentions after punctuation and line breaks", () => {
    expect(extractMentionedUsernames("Thanks!\n(@lena_o) reviewed it")).toEqual(["lena_o"]);
  });
});
