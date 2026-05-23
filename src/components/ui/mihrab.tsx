import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Mihrab({
  children,
  eyebrow,
  umber,
  seal,
  className,
}: {
  children: ReactNode;
  eyebrow?: string;
  umber?: boolean;
  seal?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[420px] overflow-hidden",
        umber
          ? "bg-[var(--bark-800)] text-[var(--paper-cream)]"
          : "bg-[var(--emerald)] text-[var(--paper-cream)]",
        className,
      )}
      style={{
        borderTopLeftRadius: "210px",
        borderTopRightRadius: "210px",
        borderBottomLeftRadius: "12px",
        borderBottomRightRadius: "12px",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-1.5"
        style={{
          border: "1px solid rgba(197,160,89,0.28)",
          borderTopLeftRadius: "205px",
          borderTopRightRadius: "205px",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
        }}
      />
      <div className="relative flex flex-col items-center px-6 pb-7 pt-12 text-center sm:px-8 sm:pb-8 sm:pt-14">
        {seal && (
          <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-[var(--paper-cream)] p-2 ring-1 ring-[var(--gold)]/40 shadow-[0_4px_14px_rgba(0,0,0,0.18)] sm:size-20">
            <Image
              src="/logo.png"
              alt=""
              aria-hidden
              width={64}
              height={64}
              className="size-full object-contain"
            />
          </div>
        )}
        {eyebrow && (
          <div className="text-[10px] uppercase tracking-[0.28em] text-[var(--gold-soft)] sm:text-[11px]">
            {eyebrow}
          </div>
        )}
        <div className="mt-3 w-full">{children}</div>
      </div>
    </div>
  );
}
