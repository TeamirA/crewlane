export const POSITION_STEP = 1000;

const MINIMUM_POSITION_GAP = 1e-6;

/**
 * Returns the position for an item inserted at `targetIndex` among `sortedPositions`
 * (which must not include the item itself), or null when neighbours are too close and
 * the list needs to be rebalanced first.
 */
export function calculatePositionAtIndex(
  sortedPositions: number[],
  targetIndex: number,
): number | null {
  if (sortedPositions.length === 0) {
    return POSITION_STEP;
  }
  const clampedIndex = Math.max(0, Math.min(targetIndex, sortedPositions.length));
  if (clampedIndex === 0) {
    return sortedPositions[0] - POSITION_STEP;
  }
  if (clampedIndex === sortedPositions.length) {
    return sortedPositions[sortedPositions.length - 1] + POSITION_STEP;
  }
  const previousPosition = sortedPositions[clampedIndex - 1];
  const nextPosition = sortedPositions[clampedIndex];
  if (nextPosition - previousPosition < MINIMUM_POSITION_GAP) {
    return null;
  }
  return (previousPosition + nextPosition) / 2;
}

export function calculatePositionAfterLast(sortedPositions: number[]): number {
  const lastPosition = sortedPositions.at(-1);
  return lastPosition === undefined ? POSITION_STEP : lastPosition + POSITION_STEP;
}
