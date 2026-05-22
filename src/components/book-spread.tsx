import Image from "next/image";
import type { Database } from "@/lib/types/db";
import { formatDate } from "@/lib/format";
import { getSeminarDisplay } from "@/lib/seminar-display";
import { FlyerViewer } from "@/components/flyer-viewer";
import { InscriptionButton } from "@/components/inscription-button";

type Seminar = Database["public"]["Tables"]["seminars"]["Row"];

function CornerBrackets({ color }: { color: string }) {
  const arm = "h-7 w-7 absolute";
  return (
    <>
      <span
        aria-hidden
        className={`${arm} left-3 top-3 border-l border-t`}
        style={{ borderColor: color }}
      />
      <span
        aria-hidden
        className={`${arm} right-3 top-3 border-r border-t`}
        style={{ borderColor: color }}
      />
      <span
        aria-hidden
        className={`${arm} left-3 bottom-3 border-l border-b`}
        style={{ borderColor: color }}
      />
      <span
        aria-hidden
        className={`${arm} right-3 bottom-3 border-r border-b`}
        style={{ borderColor: color }}
      />
    </>
  );
}

export function BookSpread({
  seminar,
  side,
  tomeNumber,
  blurb,
}: {
  seminar: Seminar;
  side: "left" | "right";
  tomeNumber: 1 | 2;
  blurb: string;
}) {
  const display = getSeminarDisplay(seminar.slug, seminar.title, seminar.author);
  const dates =
    seminar.start_date && seminar.end_date
      ? `${formatDate(seminar.start_date)} → ${formatDate(seminar.end_date)}`
      : "Dates à venir";
  const sessions = seminar.sessions_per_week
    ? `${seminar.sessions_per_week} séance${seminar.sessions_per_week > 1 ? "s" : ""} / semaine`
    : null;

  const imageFirstOnMobile = "order-1";
  const copyOnMobile = "order-2";
  const imageLgOrder = side === "left" ? "lg:order-1" : "lg:order-2";
  const copyLgOrder = side === "left" ? "lg:order-2" : "lg:order-1";
  const accent = display.palette.accent;

  return (
    <section
      id={`tome-${tomeNumber}`}
      className="relative w-full overflow-hidden"
      style={{
        background: `linear-gradient(170deg, ${display.palette.bgFrom} 0%, ${display.palette.bgTo} 100%)`,
      }}
    >
      <div className="relative mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-10 px-4 py-16 sm:gap-14 sm:px-8 sm:py-24 lg:grid-cols-2 lg:items-center lg:gap-16">
        {display.flyerSrc && (
          <div className={`relative ${imageFirstOnMobile} ${imageLgOrder}`}>
            <div className="relative">
              <FlyerViewer
                src={display.flyerSrc}
                alt={display.display_title}
                style={{ aspectRatio: "976 / 1280" }}
                className="relative block w-full overflow-hidden rounded-[2px] shadow-[0_30px_60px_rgba(0,0,0,0.35)]"
              >
                <Image
                  src={display.flyerSrc}
                  alt={display.display_title}
                  fill
                  sizes="(min-width: 1024px) 540px, 92vw"
                  priority={tomeNumber === 1}
                  className="object-cover"
                />
              </FlyerViewer>
              <CornerBrackets color={accent} />
            </div>
          </div>
        )}

        <div className={`flex flex-col ${copyOnMobile} ${copyLgOrder} text-[#fbefdf]`}>
          <p
            className="flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] sm:text-[11px]"
            style={{ color: accent }}
          >
            <span className="h-px w-8" style={{ backgroundColor: `${accent}80` }} />
            Tome {tomeNumber} · {display.overline}
          </p>

          <h2 className="mt-5 font-display text-[2rem] leading-[1.02] sm:text-[2.6rem] lg:text-[3rem]">
            {display.display_title}
          </h2>

          {seminar.author && (
            <p className="mt-3 font-serif text-[14px] italic text-[#fbefdf]/70 sm:text-[15px]">
              d&apos;après {seminar.author}
            </p>
          )}

          <p className="mt-7 max-w-[52ch] text-[15px] leading-[1.75] text-[#fbefdf]/85 sm:text-[16.5px]">
            {blurb}
          </p>

          <dl className="mt-8 grid grid-cols-1 gap-y-4 border-t pt-6 sm:grid-cols-2 sm:gap-x-8"
              style={{ borderColor: `${accent}33` }}>
            <div>
              <dt
                className="text-[10px] uppercase tracking-[0.28em]"
                style={{ color: `${accent}cc` }}
              >
                Dates
              </dt>
              <dd className="mt-1.5 font-serif text-[15px] text-[#fbefdf] sm:text-[16px]">
                {dates}
              </dd>
            </div>
            {sessions && (
              <div>
                <dt
                  className="text-[10px] uppercase tracking-[0.28em]"
                  style={{ color: `${accent}cc` }}
                >
                  Rythme
                </dt>
                <dd className="mt-1.5 font-serif text-[15px] text-[#fbefdf] sm:text-[16px]">
                  {sessions}
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-9">
            <InscriptionButton
              size="lg"
              seminarSlug={seminar.slug}
              className="!bg-[#fbefdf] !text-[#202819] !border-[#fbefdf] hover:!bg-[#e3cc9e] hover:!text-[#202819]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
