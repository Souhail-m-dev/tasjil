import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import {
  Video,
  PlayCircle,
  BookOpen,
  FileText,
  HelpCircle,
  Calendar,
  Clock,
  Send,
  PlaySquare,
  ArrowRight,
} from "lucide-react";
import { teacher, getSeminarDisplay } from "@/lib/seminar-display";
import { formatDate } from "@/lib/format";
import { InscriptionButton } from "@/components/inscription-button";
import { Mihrab } from "@/components/ui/mihrab";
import { Ornament } from "@/components/ui/ornament";
import { Pill } from "@/components/ui/pill";
import { CornerFlourish } from "@/components/ui/corner-flourish";
import type { Database } from "@/lib/types/db";

type Seminar = Database["public"]["Tables"]["seminars"]["Row"];

const seminarBlurbs: Record<string, string> = {
  "hisn-al-muslim":
    "L'étude méthodique des invocations prophétiques authentiques — leur sens, leur moment, leurs vertus — pour fortifier le musulman dans son quotidien.",
  "beaux-noms-allah":
    "Une étude structurée des Noms parfaits d'Allah, leur signification, leurs fruits et leur application dans la vie du croyant.",
  "asma-al-husna-resume":
    "Une étude structurée des Noms parfaits d'Allah, leur signification, leurs fruits et leur application dans la vie du croyant.",
};

export default async function Landing() {
  const supabase = await createClient();
  const { data: seminars, error } = await supabase
    .from("seminars")
    .select("*")
    .order("start_date", { ascending: true });

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--paper)] p-6">
        <p className="text-center text-sm font-medium text-[#a8321b]">
          Erreur : {error.message}
        </p>
      </main>
    );
  }

  const list = seminars ?? [];

  return (
    <main className="min-h-screen bg-[var(--paper)] pb-24 text-[var(--ink-900)] sm:pb-0">
      {/* TOPBAR */}
      <header className="sticky top-0 z-30 border-b border-[var(--line-soft)] bg-[var(--paper)]/85 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-[1180px] items-center justify-between gap-3 px-4 sm:h-16 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src={teacher.logoSrc}
              alt={teacher.name}
              width={36}
              height={36}
              className="size-9 shrink-0 object-contain"
              priority
            />
            <div className="min-w-0 leading-tight">
              <div className="truncate font-serif text-[13px] text-[var(--emerald-deep)] sm:text-sm">
                {teacher.name}
              </div>
              <div className="truncate text-[9px] uppercase tracking-[0.2em] text-[var(--ink-fade)] sm:text-[10px]">
                Docteur en ʿAqîda · Université de Médine
              </div>
            </div>
          </div>
          <Link
            href="/inscription"
            className="hidden h-10 items-center rounded-full bg-[var(--emerald)] px-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--gold-soft)] hover:bg-[var(--emerald-deep)] sm:inline-flex"
          >
            S&apos;inscrire
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b border-[var(--line-soft)]">
        <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-10 px-4 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <Pill tone="gold" pulse>
              Session 2026 — Été
            </Pill>
            <div
              className="mt-6 text-[15px] text-[var(--emerald-deep)] sm:text-[18px]"
              style={{ fontFamily: "var(--font-arabic), serif", direction: "rtl" }}
            >
              بِسْمِ اللهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <h1 className="mt-5 font-display text-[2.2rem] leading-[1.05] text-[var(--emerald-deep)] sm:text-[3.2rem] lg:text-[3.8rem]">
              <em className="font-serif italic text-[var(--emerald)]">
                Séminaire été 2026,
              </em>
            </h1>
            <Ornament className="my-6 justify-start sm:my-8" />
            <p className="max-w-[52ch] font-serif text-[15px] leading-[1.7] text-[var(--ink-soft,#434843)] sm:text-[17px]">
              Séminaires en ligne sous la direction de{" "}
              <strong className="text-[var(--emerald-deep)]">
                Dr. AbdelRahman Abou Abdelwahab
              </strong>
              , docteur en ʿAqîda de l&apos;Université Islamique de Médine.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link
                href="/inscription"
                className="inline-flex h-12 items-center rounded-full bg-[var(--emerald)] px-7 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--gold-soft)] shadow-[0_14px_28px_rgba(13,31,20,0.25)] transition hover:bg-[var(--emerald-deep)] sm:h-14 sm:px-9 sm:text-[13px]"
              >
                Commencer mon inscription
              </Link>
              <Link
                href="#seminaires"
                className="text-[11px] uppercase tracking-[0.28em] text-[var(--emerald-deep)] underline-offset-[10px] hover:underline sm:text-[12px]"
              >
                ↓ Les séminaires
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--emerald)] to-[var(--emerald-deep)] p-8 text-[var(--gold-soft)]">
              <CornerFlourish color="var(--gold)" />
              <div className="text-[10px] uppercase tracking-[0.32em] text-[var(--gold)]">
                Session d&apos;été · 1447 H
              </div>
              <div
                className="mt-auto flex h-full items-center justify-center text-center text-[5rem] leading-[0.95] text-[var(--gold-soft)]"
                style={{ fontFamily: "var(--font-arabic), serif", direction: "rtl" }}
              >
                أُصُولُ
                <br />
                الْعِلْمِ
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SÉMINAIRES */}
      <section id="seminaires" className="border-b border-[var(--line-soft)]">
        <div className="mx-auto w-full max-w-[1180px] px-4 py-16 sm:px-8 sm:py-24">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.32em] text-[var(--emerald)] sm:text-[11px]">
              Séminaires
            </div>
            <h2 className="mt-3 font-display text-[1.9rem] leading-tight text-[var(--emerald-deep)] sm:text-[2.6rem]">
              Deux cycles d&apos;étude cet été
            </h2>
            <Ornament className="my-6" />
            <p className="mx-auto max-w-[42ch] font-serif text-[14px] leading-[1.65] text-[var(--ink-soft,#434843)] sm:text-[16px]">
              Cours en direct sur Zoom, enregistrements, notes et quizz hebdomadaires.
              Tout est conçu pour un suivi sérieux et autonome.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-2">
            {list.map((s, idx) => (
              <SeminarCard key={s.id} seminar={s} umber={idx === 1} />
            ))}
          </div>
        </div>
      </section>

      {/* FORMAT */}
      <section className="bg-[var(--emerald)] text-[var(--paper-cream)]">
        <div className="mx-auto w-full max-w-[1180px] px-4 py-16 sm:px-8 sm:py-24">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.32em] text-[var(--gold-soft)] sm:text-[11px]">
              Le programme
            </div>
            <h2 className="mt-3 font-display text-[1.9rem] leading-tight sm:text-[2.6rem]">
              Tout ce que vous recevez
            </h2>
            <Ornament className="my-6" inverse />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
            <FormatItem icon={<Video />} title="3 cours par semaine" sub="En direct sur Zoom — Q/R en fin de cours" />
            <FormatItem icon={<PlayCircle />} title="Cours enregistrés" sub="Accès illimité aux replays pendant le séminaire" />
            <FormatItem icon={<BookOpen />} title="Notes de cours" sub="Synthèse écrite transmise après chaque séance" />
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/40 px-3.5 py-1.5 text-[11px] text-[var(--gold-soft)]">
              <FileText className="size-4" /> Support PDF AR/FR
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/40 px-3.5 py-1.5 text-[11px] text-[var(--gold-soft)]">
              <HelpCircle className="size-4" /> Quizz hebdomadaire
            </span>
          </div>
        </div>
      </section>

      {/* PROFESSEUR */}
      <section className="border-b border-[var(--line-soft)]">
        <div className="mx-auto w-full max-w-[1180px] px-4 py-16 sm:px-8 sm:py-24">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.32em] text-[var(--emerald)] sm:text-[11px]">
              Enseignant
            </div>
            <h2 className="mt-3 font-display text-[1.9rem] leading-tight text-[var(--emerald-deep)] sm:text-[2.6rem]">
              Le Professeur
            </h2>
            <Ornament className="my-6" />
          </div>

          <article className="relative mx-auto mt-8 max-w-[820px] rounded-2xl border border-[var(--line-soft)] bg-[var(--paper-cream)] p-8 shadow-[0_18px_40px_rgba(13,31,20,0.08)] sm:p-12">
            <CornerFlourish />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-[120px_1fr] sm:gap-8 sm:items-start">
              <Image
                src={teacher.logoSrc}
                alt={`Sceau ${teacher.name}`}
                width={120}
                height={120}
                className="size-24 object-contain sm:size-[120px]"
              />
              <div>
                <h3 className="font-display text-[1.5rem] text-[var(--emerald-deep)] sm:text-[1.85rem]">
                  {teacher.name}
                </h3>
                <div className="mt-1 text-[11px] uppercase tracking-[0.24em] text-[var(--emerald)]">
                  Docteur en ʿAqîda
                </div>
                <p className="mt-5 font-serif text-[15px] leading-[1.7] text-[var(--ink-soft,#434843)] sm:text-[16px]">
                  Diplômé d&apos;un doctorat en ʿAqîda à l&apos;Université Islamique de Médine.
                  Il transmet depuis plus d&apos;une décennie les sciences fondamentales —
                  Fiqh, Hadîth, Tafsîr, ʿAqîda — avec une pédagogie ancrée dans la
                  méthodologie des savants.
                </p>
                <ul className="mt-6 space-y-2.5 text-[13px] text-[var(--emerald-deep)] sm:text-[14px]">
                  {[
                    "Doctorat — Université Islamique de Médine",
                    "Spécialisation : ʿAqîda & sciences du Hadîth",
                    "Enseigne en français depuis 2014",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-3">
                      <span className="mt-2 size-1.5 shrink-0 rotate-45 bg-[var(--gold)]" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* RÉSEAUX */}
      <section className="bg-[var(--emerald)] text-[var(--paper-cream)]">
        <div className="mx-auto w-full max-w-[1180px] px-4 py-16 sm:px-8 sm:py-20">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.32em] text-[var(--gold-soft)] sm:text-[11px]">
              Restez connectés
            </div>
            <h2 className="mt-3 font-display text-[1.9rem] leading-tight sm:text-[2.4rem]">
              Suivez le professeur
            </h2>
            <Ornament className="my-6" inverse />
            <p className="mx-auto max-w-[40ch] font-serif text-[14px] leading-[1.65] text-[var(--paper-cream)]/80 sm:text-[15px]">
              Annonces de séminaires, leçons gratuites, podcasts et rappels — sur Telegram et YouTube.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SocialCard
              href="https://t.me/drabderahman"
              icon={<Send />}
              name="Telegram"
              handle="@drabderahman"
            />
            <SocialCard
              href="#"
              icon={<PlaySquare />}
              name="YouTube"
              handle="Chaîne du Dr. AbdelRahman"
            />
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="border-b border-[var(--line-soft)] bg-[var(--paper-deep)]">
        <div className="mx-auto w-full max-w-[1180px] px-4 py-16 sm:px-8 sm:py-24">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.32em] text-[var(--emerald)] sm:text-[11px]">
              Témoignages
            </div>
            <h2 className="mt-3 font-display text-[1.9rem] leading-tight text-[var(--emerald-deep)] sm:text-[2.6rem]">
              Ce qu&apos;en disent les étudiants
            </h2>
            <Ornament className="my-6" />
            <p className="mx-auto max-w-[44ch] font-serif text-[14px] leading-[1.65] text-[var(--ink-soft,#434843)] sm:text-[16px]">
              Retours des sessions précédentes — quizz, replays, suivi et adab.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
            <TestimonialCard
              quote="Les cours étaient magnifiques, bien expliqués et doucement. Les modérateurs se sont bien occupés de nous, toujours à l'écoute — qu'Allah vous récompense."
              meta="Étudiante · session précédente"
            />
            <TestimonialCard
              quote="J'ai beaucoup apprécié les quiz qui nous permettaient de vérifier nos acquis entre les cours. La forme était à la fois ludique et pédagogique."
              meta="Étudiant · session précédente"
            />
            <TestimonialCard
              quote="Le temps laissé au questions/réponses par le Shaykh à la fin de chaque cours, qu'Allah le préserve, afin de bien comprendre — en gros beaucoup de points positifs."
              meta="Étudiant · session précédente"
            />
          </div>

          <p className="mt-10 text-center font-serif text-[13px] italic text-[var(--ink-fade)] sm:text-[14px]">
            « Qu&apos;Allah récompense le Shaykh, les équipes qui l&apos;entoure et les étudiants. »
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden border-b border-[var(--line-soft)] bg-[var(--emerald-deep)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><g fill='none' stroke='%23c5a059' stroke-width='1'><path d='M100 20 L160 60 L160 140 L100 180 L40 140 L40 60 Z'/><path d='M100 50 L130 70 L130 130 L100 150 L70 130 L70 70 Z'/><circle cx='100' cy='100' r='8'/></g></svg>\")",
            backgroundSize: "180px 180px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(197,160,89,0.18), transparent 55%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-[1180px] px-4 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-[640px] text-center">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-[var(--paper-cream)] p-2.5 ring-1 ring-[var(--gold)]/40 shadow-[0_6px_20px_rgba(0,0,0,0.25)] sm:size-24">
              <Image
                src={teacher.logoSrc}
                alt=""
                width={80}
                height={80}
                className="size-full object-contain"
              />
            </div>

            <div className="mt-7">
              <Pill tone="gold" pulse>
                Inscriptions ouvertes
              </Pill>
            </div>

            <div
              className="mt-6 text-[14px] text-[var(--gold-soft)] sm:text-[16px]"
              style={{ fontFamily: "var(--font-arabic), serif", direction: "rtl" }}
            >
              بِسْمِ اللهِ
            </div>

            <h2 className="mt-4 font-display text-[2rem] leading-[1.1] text-[var(--paper-cream)] sm:text-[2.8rem] lg:text-[3.2rem]">
              Réservez votre place
            </h2>

            <Ornament className="my-6" inverse />

            <p className="mx-auto max-w-[42ch] font-serif text-[15px] leading-[1.65] text-[var(--paper-cream)]/85 sm:text-[17px]">
              Les places sont limitées pour garantir un suivi de qualité.
              L&apos;inscription précise les modalités selon le séminaire choisi.
            </p>

            <div className="mt-10 flex justify-center">
              <Link
                href="/inscription"
                className="group inline-flex h-14 items-center gap-3 rounded-full bg-[var(--gold-soft)] px-8 text-[13px] font-bold uppercase tracking-[0.18em] text-[var(--emerald-deep)] shadow-[0_14px_32px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:bg-[var(--gold)] sm:h-16 sm:px-10 sm:text-[14px]"
              >
                Commencer mon inscription
                <ArrowRight className="size-4 transition group-hover:translate-x-1 sm:size-5" />
              </Link>
            </div>

            <p className="mt-6 text-[10px] uppercase tracking-[0.22em] text-[var(--gold-soft)]/70 sm:text-[11px]">
              ◆ Tarifs et horaires précisés en cours d&apos;inscription ◆
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[var(--paper-deep)]">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col items-center gap-2 px-4 py-10 text-center text-[11px] text-[var(--ink-fade)] sm:px-8 sm:py-12">
          <Image src={teacher.logoSrc} alt="" width={36} height={36} className="size-9 opacity-60" />
          <div
            className="font-serif text-[14px] text-[var(--emerald-deep)]"
            style={{ fontFamily: "var(--font-arabic), serif", direction: "rtl" }}
          >
            وَفَّقَكُمُ اللهُ
          </div>
          <div>Tasjîl — Plateforme d&apos;inscription aux séminaires</div>
          <div className="opacity-60">© 2026 · Dr. AbdelRahman Abou Abdelwahab</div>
        </div>
      </footer>

      {/* STICKY MOBILE CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line-soft)] bg-[var(--paper)]/95 px-4 py-3 backdrop-blur sm:hidden">
        <Link
          href="/inscription"
          className="flex h-12 w-full items-center justify-center rounded-full bg-[var(--emerald)] text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--gold-soft)]"
        >
          S&apos;inscrire à un séminaire
        </Link>
      </div>
    </main>
  );
}

function SeminarCard({ seminar, umber }: { seminar: Seminar; umber: boolean }) {
  const display = getSeminarDisplay(seminar.slug, seminar.title, seminar.author);
  const blurb = seminarBlurbs[seminar.slug] ?? seminar.description ?? "";
  const dates =
    seminar.start_date && seminar.end_date
      ? `Du ${formatDate(seminar.start_date)} au ${formatDate(seminar.end_date)}`
      : "Dates à venir";
  const sessions = seminar.sessions_per_week
    ? `${seminar.sessions_per_week} cours / semaine`
    : null;

  return (
    <article className="flex flex-col rounded-2xl border border-[var(--line-soft)] bg-[var(--paper-cream)] p-6 shadow-[0_18px_38px_rgba(13,31,20,0.07)] sm:p-8">
      <div className="flex flex-col items-center text-center">
        <Pill tone="emerald" pulse>
          Inscriptions ouvertes
        </Pill>
        <div className="mt-5 w-full">
          <Mihrab eyebrow={display.overline || "Explication du livre"} umber={umber}>
            <h3 className="font-display text-[1.15rem] leading-[1.2] text-[var(--paper-cream)] sm:text-[1.35rem]">
              {display.display_title}
            </h3>
            {seminar.author && (
              <div className="mt-2 font-serif text-[12px] italic text-[var(--gold-soft)] sm:text-[13px]">
                {seminar.author}
              </div>
            )}
          </Mihrab>
        </div>
      </div>

      {seminar.title_ar && (
        <div
          className="mt-6 text-center text-[1.4rem] text-[var(--emerald-deep)] sm:text-[1.6rem]"
          style={{ fontFamily: "var(--font-arabic), serif", direction: "rtl" }}
        >
          {seminar.title_ar}
        </div>
      )}

      <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-3 gap-y-3 text-[13px] text-[var(--ink-soft,#434843)] sm:text-[14px]">
        <dt className="flex items-center text-[var(--emerald)]"><Calendar className="size-4" /></dt>
        <dd>{dates}</dd>
        {sessions && (
          <>
            <dt className="flex items-center text-[var(--emerald)]"><Clock className="size-4" /></dt>
            <dd>{sessions}</dd>
          </>
        )}
        {seminar.author && (
          <>
            <dt className="flex items-center text-[var(--emerald)]"><BookOpen className="size-4" /></dt>
            <dd>{seminar.author}</dd>
          </>
        )}
      </dl>

      {blurb && (
        <p className="mt-4 font-serif text-[14px] leading-[1.6] text-[var(--ink-soft,#434843)] sm:text-[15px]">
          {blurb}
        </p>
      )}

      <div className="mt-6">
        <InscriptionButton
          size="lg"
          seminarSlug={seminar.slug}
          className="!w-full !bg-[var(--emerald)] !border-[var(--emerald)] !text-[var(--gold-soft)] hover:!bg-[var(--emerald-deep)]"
        />
      </div>
    </article>
  );
}

function FormatItem({
  icon,
  title,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-[var(--gold)]/20 bg-[var(--emerald-deep)]/40 p-5">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--gold)]/15 text-[var(--gold-soft)]">
        {icon}
      </div>
      <div>
        <div className="font-serif text-[15px] text-[var(--paper-cream)] sm:text-[16px]">
          {title}
        </div>
        <div className="mt-1 text-[12px] leading-[1.5] text-[var(--paper-cream)]/70 sm:text-[13px]">
          {sub}
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({ quote, meta }: { quote: string; meta: string }) {
  return (
    <figure className="relative flex h-full flex-col rounded-2xl border border-[var(--line-soft)] bg-[var(--paper-cream)] p-6 shadow-[0_14px_30px_rgba(13,31,20,0.06)] sm:p-7">
      <CornerFlourish color="var(--gold)" />
      <div
        aria-hidden
        className="font-display text-[3rem] leading-none text-[var(--gold)] sm:text-[4rem]"
      >
        “
      </div>
      <blockquote className="mt-2 font-serif text-[15px] leading-[1.65] text-[var(--ink-900)] sm:text-[16px]">
        {quote}
      </blockquote>
      <figcaption className="mt-5 text-[10px] uppercase tracking-[0.24em] text-[var(--emerald)] sm:text-[11px]">
        {meta}
      </figcaption>
    </figure>
  );
}

function SocialCard({
  href,
  icon,
  name,
  handle,
}: {
  href: string;
  icon: React.ReactNode;
  name: string;
  handle: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-xl border border-[var(--gold)]/20 bg-[var(--emerald-deep)]/40 p-5 transition hover:border-[var(--gold)]/60"
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[var(--gold)]/15 text-[var(--gold-soft)]">
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-serif text-[15px] text-[var(--paper-cream)]">
          {name}
        </div>
        <div className="mt-0.5 text-[12px] text-[var(--paper-cream)]/70">{handle}</div>
      </div>
      <ArrowRight className="size-4 text-[var(--gold-soft)] transition group-hover:translate-x-1" />
    </a>
  );
}

export const metadata = {
  title: "Tasjîl — Séminaires du Dr. AbdelRahman",
};
