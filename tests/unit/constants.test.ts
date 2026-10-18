import { describe, expect, it } from "vitest";

import { DEFAULT_COLUMN_NAMES } from "@/lib/constants";

describe("DEFAULT_COLUMN_NAMES", () => {
  it("starts every new board with three workflow columns", () => {
    expect(DEFAULT_COLUMN_NAMES).toEqual(["To Do", "In Progress", "Done"]);
  });
});
