import { type ClassValue, clsx } from "clsx";

export function cn(...classValues: ClassValue[]): string {
  return clsx(classValues);
}
