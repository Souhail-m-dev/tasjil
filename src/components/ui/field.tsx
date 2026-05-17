import { cn } from "@/lib/utils";

export function Field({
  htmlFor,
  error,
  hint,
  children,
  className,
}: {
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {children}
      {hint && !error && (
        <p className="px-1 text-left text-[12px] text-[#5e6353]">{hint}</p>
      )}
      {error && (
        <p
          className="px-1 text-left text-[12px] font-medium text-[#a8321b]"
          id={htmlFor ? `${htmlFor}-err` : undefined}
        >
          {error}
        </p>
      )}
    </div>
  );
}

// Min height 48px (touch target). text-base = 16px to avoid iOS auto-zoom.
export const inputClass =
  "w-full rounded-xl border border-[#cdc5b3] bg-[#fbefdf] px-4 py-3 text-base text-[#202819] placeholder:text-[#98927f] focus:outline-none focus:border-[#546b43] focus:ring-2 focus:ring-[#546b43]/25 transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]";

export const labelClass = "block px-1 text-[13px] font-medium text-[#3c4130]";
