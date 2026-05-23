import { cn } from "@/lib/utils";

export function Ornament({
  inverse,
  className,
}: {
  inverse?: boolean;
  className?: string;
}) {
  const line = inverse
    ? "bg-[var(--gold-soft)]/40"
    : "bg-[var(--emerald)]/30";
  const diamond = inverse ? "bg-[var(--gold-soft)]" : "bg-[var(--gold)]";
  return (
    <div
      aria-hidden
      className={cn(
        "flex items-center justify-center gap-3 py-2",
        className,
      )}
    >
      <span className={cn("h-px w-12 sm:w-20", line)} />
      <span className={cn("size-1.5 rotate-45", diamond)} />
      <span className={cn("h-px w-12 sm:w-20", line)} />
    </div>
  );
}
