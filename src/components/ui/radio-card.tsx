"use client";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function RadioCard({
  checked,
  onSelect,
  title,
  subtitle,
  icon,
  className,
}: {
  checked: boolean;
  onSelect: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={checked}
      className={cn(
        "relative flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#546b43]/35 active:scale-[0.99] sm:p-4",
        checked
          ? "border-[#546b43] bg-[#fbefdf] shadow-[0_12px_24px_rgba(32,40,25,0.10)]"
          : "border-[#cdc5b3] bg-[#f2eadf] hover:border-[#98927f] hover:bg-[#f7ecd9]",
        className,
      )}
    >
      {icon && <div className="mt-0.5 shrink-0 text-[#546b43]">{icon}</div>}
      <div className="min-w-0 flex-1">
        <div className="font-serif text-[15px] leading-snug text-[#202819] sm:text-base">
          {title}
        </div>
        {subtitle && (
          <div className="mt-0.5 text-[13px] leading-snug text-[#5e6353] sm:text-sm">
            {subtitle}
          </div>
        )}
      </div>
      <div
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition",
          checked
            ? "border-[#546b43] bg-[#546b43] text-[#fbefdf]"
            : "border-[#98927f] bg-transparent",
        )}
      >
        {checked && <Check className="size-3.5" strokeWidth={3} />}
      </div>
    </button>
  );
}
