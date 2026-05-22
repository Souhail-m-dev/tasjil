import { Calendar } from "lucide-react";
import type { Database } from "@/lib/types/db";
import { formatDate } from "@/lib/format";
import { getSeminarDisplay } from "@/lib/seminar-display";
import { cn } from "@/lib/utils";
import { FlyerPanelThumb } from "@/components/flyer-panel-thumb";

type Seminar = Database["public"]["Tables"]["seminars"]["Row"];

export function SeminarPanel({
  seminar,
  side,
}: {
  seminar: Seminar;
  side: "left" | "right";
}) {
  const display = getSeminarDisplay(seminar.slug, seminar.title, seminar.author);
  const isLeft = side === "left";
  const datesLabel =
    seminar.start_date && seminar.end_date
      ? `Du ${formatDate(seminar.start_date)} au ${formatDate(seminar.end_date)}`
      : "Dates à venir";

  return (
    <article
      className={cn(
        "relative flex w-full overflow-hidden rounded-2xl border text-[#fbefdf] shadow-[0_12px_24px_rgba(32,40,25,0.16)] transition",
        "active:scale-[0.99] sm:hover:-translate-y-0.5 sm:hover:shadow-[0_22px_44px_rgba(32,40,25,0.24)]",
      )}
      style={{
        background: isLeft
          ? "linear-gradient(180deg, #32241B 0%, #23170E 100%)"
          : "linear-gradient(180deg, #3C4130 0%, #202819 100%)",
        borderColor: "rgba(227,204,158,0.22)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 18%, rgba(227,204,158,0.4) 0%, transparent 26%), radial-gradient(circle at 82% 80%, rgba(227,204,158,0.3) 0%, transparent 24%)",
        }}
      />

      <div className="relative flex min-w-0 flex-1 flex-col justify-between gap-3 px-4 py-4 sm:min-h-[220px] sm:gap-4 sm:px-6 sm:py-6">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#e3cc9e]/85 sm:text-[11px] sm:tracking-[0.32em]">
            {display.overline || "Séminaire"}
          </p>
          <h2 className="mt-2 font-display text-[1.4rem] leading-[1.08] sm:mt-2 sm:max-w-[14ch] sm:text-[2rem] sm:leading-[0.98]">
            {display.display_title}
          </h2>
          {seminar.author && (
            <p className="mt-1 font-serif text-[12px] italic text-[#fbefdf]/70 sm:hidden">
              {seminar.author}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 border-t border-[#e3cc9e]/15 pt-2.5 sm:block sm:border-0 sm:space-y-1.5 sm:pt-0">
          <Calendar className="size-3.5 shrink-0 text-[#e3cc9e]/70 sm:hidden" strokeWidth={2} />
          <p className="text-[11px] uppercase tracking-[0.1em] text-[#fbefdf]/80 sm:text-sm sm:tracking-[0.16em]">
            {datesLabel}
          </p>
          {seminar.author && (
            <p className="hidden font-serif italic text-[#fbefdf]/70 sm:block sm:text-sm">
              {seminar.author}
            </p>
          )}
        </div>
      </div>

      {display.flyerSrc && (
        <div className="hidden sm:flex">
          <FlyerPanelThumb
            src={display.flyerSrc}
            alt={display.display_title}
          />
        </div>
      )}
    </article>
  );
}
