export function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((existingId) => existingId !== id) : [...ids, id];
}
