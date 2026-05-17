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
        isLg ? "h-12 px-9 text-sm md:h-14 md:px-11 md:text-base" : "h-11 px-6 text-xs md:h-12 md:px-8 md:text-sm",
        className,
      )}
    >
      S&apos;inscrire
    </Link>
  );
}
