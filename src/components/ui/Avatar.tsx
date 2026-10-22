import { cn } from "@/lib/cn";

interface AvatarProps {
  name: string;
  seed: string;
  size?: "xs" | "sm" | "md";
  className?: string;
}

const AVATAR_COLORS = [
  "bg-indigo-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-teal-500",
];

const sizeClasses = { xs: "size-6 text-[10px]", sm: "size-8 text-xs", md: "size-10 text-sm" };

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

function pickColor(seed: string): string {
  const hash = [...seed].reduce((total, character) => total + character.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function Avatar({ name, seed, size = "sm", className }: AvatarProps) {
  return (
    <span
      title={name}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        "ring-2 ring-white",
        pickColor(seed),
        sizeClasses[size],
        className,
      )}
    >
      <span aria-hidden="true">{getInitials(name)}</span>
      <span className="sr-only">{name}</span>
    </span>
  );
}

interface AvatarStackProps {
  people: { id: string; displayName: string }[];
  maxVisible?: number;
  size?: AvatarProps["size"];
}

export function AvatarStack({ people, maxVisible = 4, size = "xs" }: AvatarStackProps) {
  const hiddenCount = people.length - maxVisible;
  return (
    <span className="flex -space-x-1.5">
      {people.slice(0, maxVisible).map((person) => (
        <Avatar key={person.id} name={person.displayName} seed={person.id} size={size} />
      ))}
      {hiddenCount > 0 && (
        <span className="inline-flex size-6 items-center justify-center rounded-full bg-neutral-200 text-[10px] font-semibold ring-2 ring-white">
          +{hiddenCount}
        </span>
      )}
    </span>
  );
}
