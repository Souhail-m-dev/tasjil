import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import {
  BookOpen,
  FileText,
  HelpCircle,
  PlayCircle,
  Video,
} from "lucide-react";
import { teacher } from "@/lib/seminar-display";
import { InscriptionButton } from "@/components/inscription-button";
import { SeminarPanel } from "@/components/seminar-panel";

function getSharedItems(
  seminars: {
    zoom: boolean | null;
    is_recorded: boolean | null;
    has_notes: boolean | null;
    has_pdf_support: boolean | null;
    has_weekly_quiz: boolean | null;
  }[],
) {
  const items = [
    {
      label: "Cours sur Zoom",
      detail: "En direct chaque semaine",
      icon: Video,
      show: seminars.every((s) => !!s.zoom),
    },
    {
      label: "Cours enregistrés",
      detail: "Révision libre après le cours",
      icon: PlayCircle,
      show: seminars.every((s) => !!s.is_recorded),
    },
    {
      label: "Notes de cours",
      detail: "Support de suivi structuré",
      icon: BookOpen,
      show: seminars.every((s) => !!s.has_notes),
    },
    {
      label: "Support PDF",
      detail: "Documents complémentaires",
      icon: FileText,
      show: seminars.every((s) => !!s.has_pdf_support),
    },
    {
      label: "Quizz hebdomadaire",
      detail: "Progression et révision",
      icon: HelpCircle,
      show: seminars.every((s) => !!s.has_weekly_quiz),
    },
  ];

  return items.filter((i) => i.show);
}

export default async function Home() {
  const supabase = await createClient();
  const { data: seminars, error } = await supabase
    .from("seminars")
    .select("*")
    .order("start_date", { ascending: true });

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f2eadf] p-6">
        <p className="text-center text-sm font-medium text-[#a8321b]">
          Erreur : {error.message}
        </p>
      </main>
    );
  }

  const [first, second] = seminars ?? [];
  const sharedItems = getSharedItems(
    [first, second].filter((s): s is NonNullable<typeof s> => !!s),
  );

  return (
    <main
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg, #f2eadf 0%, #e9e1d2 100%)",
      }}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-[1280px] flex-col px-3 py-4 sm:px-6 sm:py-6 lg:px-10">
        {/* Hero / Teacher card */}
        <section className="rounded-2xl border border-[#d6cfc0] bg-[#fbefdf] px-4 py-5 text-center shadow-[0_12px_28px_rgba(32,40,25,0.07)] sm:px-7 sm:py-7">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-5">
            <Image
              src={teacher.logoSrc}
              alt={`Logo ${teacher.name}`}
              width={112}
              height={112}
              className="h-auto w-16 object-contain sm:w-24"
              priority
            />
            <div className="text-center sm:text-left">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#546b43] sm:text-[11px]">
                {teacher.role}
              </p>
              <p className="mt-1 font-serif text-base text-[#202819] sm:text-2xl">
                {teacher.name}
              </p>
            </div>
          </div>
          <p className="mx-auto mt-3 max-w-2xl text-[13px] leading-6 text-[#5e6353] sm:text-base">
            Diplômé d’un doctorat en théologie islamique à l’université islamique de Médine
          </p>
          <h1 className="mt-4 font-display text-[1.75rem] leading-tight text-[#202819] sm:text-[2.5rem]">
            Séminaire été 2026
          </h1>
          <p className="mt-1 font-serif italic text-[13px] text-[#546b43] sm:text-base">
            
          </p>
        </section>

        {/* Main panel */}
        <section className="mt-4 flex-1 sm:mt-6">
          <div className="grid grid-cols-1 gap-3 rounded-2xl border border-[#d6cfc0] bg-[#fbefdf] p-3 shadow-[0_12px_28px_rgba(32,40,25,0.07)] sm:gap-4 sm:p-5 lg:grid-cols-[320px_minmax(0,1fr)]">
            {/* Seminars on mobile first */}
            <div className="order-1 flex items-center justify-center rounded-xl border border-[#d6cfc0] bg-[#fbefdf] p-3 sm:p-5 lg:order-2 lg:p-6">
              <div
                className="grid w-full max-w-[46rem] grid-cols-1 gap-3 sm:gap-4"
                style={{ gridAutoRows: "1fr" }}
              >
                {first && <SeminarPanel seminar={first} side="left" />}
                {second && <SeminarPanel seminar={second} side="right" />}
              </div>
            </div>

            {/* Mobile CTA — sticky-feel, above shared list */}
            <div className="order-2 lg:hidden">
              <InscriptionButton size="lg" className="!w-full" />
            </div>

            {/* Shared info */}
            <aside className="order-3 rounded-xl border border-[#d6cfc0] bg-[#f2eadf] p-4 text-[#202819] sm:p-6 lg:order-1">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#546b43] sm:text-[11px]">
                Informations communes
              </p>

              <div className="mt-3 grid grid-cols-1 gap-2 sm:mt-5 sm:gap-3">
                {sharedItems.map((item) => (
                  <div
                    key={item.label}
                    className="group rounded-xl border border-[#d6cfc0] bg-[linear-gradient(180deg,#fbefdf_0%,#f2eadf_100%)] p-3 transition hover:border-[#546b43] hover:bg-[linear-gradient(180deg,#ffffff_0%,#f7eedd_100%)]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#cdc5b3] bg-[linear-gradient(180deg,#e4d4b7_0%,#e3cc9e_100%)] text-[#3c4130] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] sm:size-10">
                        <item.icon className="size-4 sm:size-4.5" strokeWidth={1.8} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium leading-5 text-[#202819] sm:text-[15px]">
                          {item.label}
                        </p>
                        <p className="mt-0.5 text-[11px] leading-4 text-[#5e6353] sm:text-sm sm:leading-5">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 hidden border-t border-[#d6cfc0] pt-4 lg:block">
                <div className="mt-4">
                  <InscriptionButton size="lg" className="!w-full" />
                </div>
              </div>
            </aside>
          </div>
        </section>

        <footer className="mt-4 flex justify-center pb-2 pt-1">
          <a
            href="https://t.me/drabderahman"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center rounded-lg border border-[#d6cfc0] bg-[#fbefdf] px-4 text-[13px] text-[#3c4130] transition hover:border-[#546b43] hover:text-[#202819] sm:text-sm"
          >
            Telegram : @drabderahman
          </a>
        </footer>
      </div>
    </main>
  );
}
