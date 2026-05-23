import { cn } from "@/lib/utils";

export function CornerFlourish({ color = "var(--gold)" }: { color?: string }) {
  const arm = "absolute h-6 w-6";
  return (
    <>
      <span
        aria-hidden
        className={cn(arm, "left-3 top-3 border-l border-t")}
        style={{ borderColor: color }}
      />
      <span
        aria-hidden
        className={cn(arm, "right-3 top-3 border-r border-t")}
        style={{ borderColor: color }}
      />
      <span
        aria-hidden
        className={cn(arm, "left-3 bottom-3 border-l border-b")}
        style={{ borderColor: color }}
      />
      <span
        aria-hidden
        className={cn(arm, "right-3 bottom-3 border-r border-b")}
        style={{ borderColor: color }}
      />
    </>
  );
}
