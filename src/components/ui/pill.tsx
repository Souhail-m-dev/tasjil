import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Pill({
  tone = "emerald",
  pulse,
  children,
  className,
}: {
  tone?: "emerald" | "upcoming" | "gold";
  pulse?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const styles = {
    emerald: "bg-[var(--emerald)] text-[var(--gold-soft)]",
    upcoming: "bg-[var(--paper-deep)] text-[var(--ink-fade)]",
    gold: "bg-[var(--gold)] text-[var(--emerald-deep)]",
  }[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] sm:text-[11px]",
        styles,
        className,
      )}
    >
      {pulse && (
        <span className="relative inline-flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-60" />
          <span className="relative inline-flex size-1.5 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}
