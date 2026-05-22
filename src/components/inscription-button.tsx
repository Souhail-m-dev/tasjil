import Link from "next/link";
import { cn } from "@/lib/utils";

export function InscriptionButton({
  size = "lg",
  seminarSlug,
  className,
}: {
  size?: "sm" | "lg";
  seminarSlug?: string;
  className?: string;
}) {
  const href = seminarSlug
    ? `/inscription?seminar=${seminarSlug}`
    : "/inscription";

  const isLg = size === "lg";

  return (
    <Link
      href={href}
      aria-label="S'inscrire au séminaire"
      className={cn(
        "group pointer-events-auto relative inline-flex items-center justify-center rounded-full font-serif font-bold uppercase tracking-[0.18em] transition-all duration-300",
        "bg-[#202819] text-[#fbefdf] border border-[#202819] shadow-[0_12px_28px_rgba(32,40,25,0.28)]",
        "hover:scale-[1.02] hover:bg-[#3c4130] hover:shadow-[0_16px_36px_rgba(32,40,25,0.34)]",
        "active:scale-95",
        isLg ? "h-11 px-6 text-[12px] tracking-[0.16em] sm:h-14 sm:px-11 sm:text-base sm:tracking-[0.18em]" : "h-10 px-5 text-[11px] sm:h-12 sm:px-8 sm:text-sm",
        className,
      )}
    >
      S&apos;inscrire
    </Link>
  );
}
