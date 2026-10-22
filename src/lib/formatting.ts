const dateFormatter = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" });

const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const RELATIVE_TIME_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

export function formatRole(role: string): string {
  return role.charAt(0) + role.slice(1).toLowerCase();
}

export function formatShortDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}

export function formatRelativeTime(isoDate: string, now: Date = new Date()): string {
  const elapsedSeconds = Math.round((new Date(isoDate).getTime() - now.getTime()) / 1000);
  for (const [unit, secondsInUnit] of RELATIVE_TIME_UNITS) {
    if (Math.abs(elapsedSeconds) >= secondsInUnit) {
      return relativeTimeFormatter.format(Math.round(elapsedSeconds / secondsInUnit), unit);
    }
  }
  return "just now";
}
