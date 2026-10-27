import { describe, expect, it } from "vitest";

import {
  calculatePositionAfterLast,
  calculatePositionAtIndex,
} from "@/core/domain/services/positioning";

describe("calculatePositionAtIndex", () => {
  it("starts an empty list at the first step", () => {
    expect(calculatePositionAtIndex([], 0)).toBe(1000);
  });

  it("places items before the first, between neighbours, and after the last", () => {
    const positions = [1000, 2000, 3000];
    expect(calculatePositionAtIndex(positions, 0)).toBe(0);
    expect(calculatePositionAtIndex(positions, 1)).toBe(1500);
    expect(calculatePositionAtIndex(positions, 3)).toBe(4000);
  });

  it("clamps indexes that are out of range", () => {
    expect(calculatePositionAtIndex([1000], 10)).toBe(2000);
    expect(calculatePositionAtIndex([1000], -4)).toBe(0);
  });

  it("asks for a rebalance when neighbours are too close together", () => {
    expect(calculatePositionAtIndex([1000, 1000 + 1e-7], 1)).toBeNull();
  });
});

describe("calculatePositionAfterLast", () => {
  it("appends one step after the last position", () => {
    expect(calculatePositionAfterLast([500, 1700])).toBe(2700);
    expect(calculatePositionAfterLast([])).toBe(1000);
  });
});
