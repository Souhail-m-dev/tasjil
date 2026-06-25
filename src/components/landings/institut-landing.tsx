import Image from "next/image";
import Link from "next/link";
import {
  Video,
  Users,
  Award,
  PlayCircle,
  FileText,
  Send,
  PlaySquare,
  ArrowRight,
  CalendarClock,
  MapPin,
} from "lucide-react";
import { getTenant } from "@/lib/tenants";
import { Pill } from "@/components/ui/pill";
import { Ornament } from "@/components/ui/ornament";
import { CornerFlourish } from "@/components/ui/corner-flourish";

const NIVEAUX = [
  { name: "Niveau 1", day: "Jeudi · 19h00", note: "Fondations" },
  { name: "Niveau 2", day: "Vendredi · 19h00", note: "Approfondissement" },
];

const MATIERES = [
  { ar: "التوحيد", fr: "Tawhîd", sub: "L'unicité d'Allah" },
  { ar: "السيرة", fr: "Sîra", sub: "La vie du Prophète ﷺ" },
  { ar: "الفقه", fr: "Fiqh", sub: "La jurisprudence" },
  { ar: "الحديث", fr: "Hadîth", sub: "La science prophétique" },
];

const TEMOIGNAGES = [
  {
    quote:
      "Les cours étaient magnifiques, bien expliqués et posément. Quelques soucis de connexion, mais rien de désagréable — avec l'expérience, ce sera de mieux en mieux inchâ'Allah.",
    meta: "Étudiant · session précédente",
  },
  {
    quote:
      "Les modérateurs se sont bien occupés de nous, par mail comme par Telegram, toujours à l'écoute. Et le déroulement du cours bien encadré, micros et vidéos des sœurs bloqués pour éviter toute fitna. Bravo.",
    meta: "Étudiante · session précédente",
  },
  {
    quote:
      "J'ai beaucoup apprécié les quiz qui nous permettaient de vérifier nos acquis entre les cours. La forme était à la fois ludique et pédagogique — important dans une formation à distance.",
    meta: "Étudiant · session précédente",
  },
  {
    quote:
      "J'ai aimé les vidéos pour rattraper les cours manqués. Le top du top, les quiz pour réviser : tous les éléments étaient là pour comprendre le livre et réussir l'examen.",
    meta: "Étudiant · session précédente",
  },
  {
    quote:
      "Telegram était super bien organisé, avec les chapitres — je n'ai jamais vu cela dans les autres cours que j'ai suivis. Et le travail des sœurs sur les notes de cours, qu'Allah les récompense.",
    meta: "Étudiante · session précédente",
  },
  {
    quote:
      "Le temps laissé aux questions/réponses par le Shaykh à la fin de chaque cours, afin de bien comprendre — qu'Allah le préserve. En gros, beaucoup de points positifs.",
    meta: "Étudiant · session précédente",
  },
];

export default async function InstitutLanding() {
  const { brand, prof, schedule } = await getTenant();

  return (
    <main className="min-h-screen bg-[var(--paper)] pb-24 text-[var(--ink-900)] sm:pb-0">
      {/* TOPBAR */}
      <header className="sticky top-0 z-30 border-b border-[var(--line-soft)] bg-[var(--paper)]/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1180px] items-center justify-between gap-3 px-4 sm:h-20 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src={brand.logoSrc}
              alt={brand.name}
              width={56}
              height={56}
              className="size-12 shrink-0 object-contain sm:size-14"
              priority
            />
            <div className="min-w-0 leading-tight">
              <div className="truncate font-serif text-[13px] text-[var(--emerald-deep)] sm:text-sm">
                {brand.name}
              </div>
              <div className="truncate text-[9px] uppercase tracking-[0.2em] text-[var(--ink-fade)] sm:text-[10px]">
                {prof.role}
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
        <div className="mx-auto w-full max-w-[1180px] px-4 py-14 sm:px-8 sm:py-20">
          <div className="max-w-[60ch]">
            <Pill tone="gold" pulse>
              Année 2026 — 2027
            </Pill>
            <div
              className="mt-6 text-[15px] text-[var(--emerald-deep)] sm:text-[18px]"
              style={{ fontFamily: "var(--font-arabic), serif", direction: "rtl" }}
            >
              بِسْمِ اللهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <h1 className="mt-5 font-display text-[2.2rem] leading-[1.05] text-[var(--emerald-deep)] sm:text-[3.2rem] lg:text-[3.6rem]">
              Une année structurée
              <br />
              <em className="font-serif italic text-[var(--emerald)]">
                en sciences islamiques.
              </em>
            </h1>
            <Ornament className="my-6 justify-start sm:my-8" />
            <p className="max-w-[54ch] font-serif text-[15px] leading-[1.7] text-[var(--ink-soft,#434843)] sm:text-[17px]">
              Cursus annuel sous la direction de{" "}
              <strong className="text-[var(--emerald-deep)]">{prof.name}</strong>,{" "}
              {prof.role.toLowerCase()}. Du 10 septembre 2026 au 28 mai 2027
              (pause durant le Ramadan).
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link
                href="/inscription"
                className="inline-flex h-12 items-center rounded-full bg-[var(--emerald)] px-7 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--gold-soft)] shadow-[0_14px_28px_rgba(13,31,20,0.25)] transition hover:bg-[var(--emerald-deep)] sm:h-14 sm:px-9 sm:text-[13px]"
              >
                Commencer mon inscription
              </Link>
              <Link
                href="#niveaux"
                className="text-[11px] uppercase tracking-[0.28em] text-[var(--emerald-deep)] underline-offset-[10px] hover:underline sm:text-[12px]"
              >
                ↓ Les niveaux
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* NIVEAUX */}
      <section id="niveaux" className="border-b border-[var(--line-soft)]">
        <div className="mx-auto w-full max-w-[1180px] px-4 py-16 sm:px-8 sm:py-24">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.32em] text-[var(--emerald)] sm:text-[11px]">
              Les niveaux
            </div>
            <h2 className="mt-3 font-display text-[1.9rem] leading-tight text-[var(--emerald-deep)] sm:text-[2.6rem]">
              Deux niveaux d&apos;étude
            </h2>
            <Ornament className="my-6" />
            <p className="mx-auto max-w-[44ch] font-serif text-[14px] leading-[1.65] text-[var(--ink-soft,#434843)] sm:text-[16px]">
              {schedule}
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-[860px] grid-cols-1 gap-8 sm:gap-10 sm:grid-cols-2">
            {NIVEAUX.map((n) => (
              <article
                key={n.name}
                className="flex flex-col rounded-2xl border border-[var(--line-soft)] bg-[var(--paper-cream)] p-6 text-center shadow-[0_18px_38px_rgba(13,31,20,0.07)] sm:p-8"
              >
                <Pill tone="emerald" pulse>
                  Inscriptions ouvertes
                </Pill>
                <h3 className="mt-5 font-display text-[1.6rem] text-[var(--emerald-deep)]">
                  {n.name}
                </h3>
                <div className="mt-2 inline-flex items-center justify-center gap-2 text-[13px] text-[var(--emerald)]">
                  <CalendarClock className="size-4" /> {n.day}
                </div>
                <div className="mt-1 text-[12px] uppercase tracking-[0.2em] text-[var(--ink-fade)]">
                  {n.note}
                </div>
                <div className="mt-6">
                  <Link
                    href="/inscription"
                    className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[var(--emerald)] text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--gold-soft)] hover:bg-[var(--emerald-deep)]"
                  >
                    Choisir ce niveau
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* MATIÈRES */}
      <section className="bg-[var(--emerald)] text-[var(--paper-cream)]">
        <div className="mx-auto w-full max-w-[1180px] px-4 py-16 sm:px-8 sm:py-24">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.32em] text-[var(--gold-soft)] sm:text-[11px]">
              Le programme
            </div>
            <h2 className="mt-3 font-display text-[1.9rem] leading-tight sm:text-[2.6rem]">
              Quatre matières fondamentales
            </h2>
            <Ornament className="my-6" inverse />
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {MATIERES.map((m) => (
              <div
                key={m.fr}
                className="rounded-xl border border-[var(--gold)]/20 bg-[var(--emerald-deep)]/40 p-5 text-center"
              >
                <div
                  className="text-[1.8rem] text-[var(--gold-soft)]"
                  style={{ fontFamily: "var(--font-arabic), serif", direction: "rtl" }}
                >
                  {m.ar}
                </div>
                <div className="mt-2 font-serif text-[16px] text-[var(--paper-cream)]">
                  {m.fr}
                </div>
                <div className="mt-1 text-[12px] text-[var(--paper-cream)]/70">
                  {m.sub}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
            <FormatItem icon={<Video />} title="Distanciel & présentiel" sub="En ligne, ou en présentiel à Lyon (salle séparée pour les sœurs)" />
            <FormatItem icon={<PlayCircle />} title="Cours enregistrés" sub="Accès aux replays tout au long de l'année" />
            <FormatItem icon={<Award />} title="Certificat" sub="Délivré à la fin du cursus annuel" />
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/40 px-3.5 py-1.5 text-[11px] text-[var(--gold-soft)]">
              <FileText className="size-4" /> Support PDF
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/40 px-3.5 py-1.5 text-[11px] text-[var(--gold-soft)]">
              <Users className="size-4" /> Hommes & femmes · 16 ans et +
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/40 px-3.5 py-1.5 text-[11px] text-[var(--gold-soft)]">
              <MapPin className="size-4" /> Lyon
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
                src={brand.logoSrc}
                alt={`Sceau ${prof.name}`}
                width={120}
                height={120}
                className="size-24 object-contain sm:size-[120px]"
              />
              <div>
                <h3 className="font-display text-[1.5rem] text-[var(--emerald-deep)] sm:text-[1.85rem]">
                  {prof.name}
                </h3>
                <div className="mt-1 text-[11px] uppercase tracking-[0.24em] text-[var(--emerald)]">
                  {prof.role}
                </div>
                <p className="mt-5 font-serif text-[15px] leading-[1.7] text-[var(--ink-soft,#434843)] sm:text-[16px]">
                  {prof.name}, diplômé de l&apos;Université Islamique de Médine,
                  dirige ce cursus annuel structuré en sciences islamiques.
                  {/* TODO: remplacer par la biographie complète fournie par le professeur */}
                </p>
                {prof.tazkiyaUrl && (
                  <a
                    href={prof.tazkiyaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--emerald)] underline-offset-[6px] hover:text-[var(--emerald-deep)] hover:underline sm:text-[13px]"
                  >
                    <PlaySquare className="size-4" /> Voir la tazkiya
                    <ArrowRight className="size-3.5" />
                  </a>
                )}
                <ul className="mt-6 space-y-2.5 text-[13px] text-[var(--emerald-deep)] sm:text-[14px]">
                  {[
                    "Diplômé de l'Université Islamique de Médine",
                    "Cursus annuel : Tawhîd · Sîra · Fiqh · Hadîth",
                    "Distanciel et présentiel à Lyon",
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
              Retours des sessions précédentes.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
            {TEMOIGNAGES.map((t) => (
              <TestimonialCard key={t.meta + t.quote.slice(0, 16)} quote={t.quote} meta={t.meta} />
            ))}
          </div>

          <p className="mt-10 text-center font-serif text-[13px] italic text-[var(--ink-fade)] sm:text-[14px]">
            « Qu&apos;Allah récompense le Shaykh, les équipes qui l&apos;entourent et les étudiants. »
          </p>
        </div>
      </section>

      {/* RÉSEAUX */}
      {prof.telegram && (
        <section className="bg-[var(--emerald)] text-[var(--paper-cream)]">
          <div className="mx-auto w-full max-w-[1180px] px-4 py-16 sm:px-8 sm:py-20">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-[0.32em] text-[var(--gold-soft)] sm:text-[11px]">
                Restez connectés
              </div>
              <h2 className="mt-3 font-display text-[1.9rem] leading-tight sm:text-[2.4rem]">
                Suivez l&apos;institut
              </h2>
              <Ornament className="my-6" inverse />
            </div>

            <div className="mx-auto mt-10 grid max-w-[560px] grid-cols-1 gap-4">
              <SocialCard
                href={prof.telegram}
                icon={<Send />}
                name="Telegram"
                handle="Rappels & annonces"
              />
            </div>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className="relative overflow-hidden border-b border-[var(--line-soft)] bg-[var(--emerald-deep)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(184,137,75,0.18), transparent 55%)",
          }}
        />
        <div className="relative mx-auto w-full max-w-[1180px] px-4 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-[640px] text-center">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-[var(--paper-cream)] p-2.5 ring-1 ring-[var(--gold)]/40 shadow-[0_6px_20px_rgba(0,0,0,0.25)] sm:size-24">
              <Image
                src={brand.logoSrc}
                alt=""
                width={80}
                height={80}
                className="size-full object-contain"
              />
            </div>

            <div className="mt-7">
              <Pill tone="gold" pulse>
                350€ pour l&apos;année · non remboursable
              </Pill>
            </div>

            <h2 className="mt-6 font-display text-[2rem] leading-[1.1] text-[var(--paper-cream)] sm:text-[2.8rem] lg:text-[3.2rem]">
              Réservez votre place
            </h2>

            <Ornament className="my-6" inverse />

            <div className="mt-4 flex justify-center">
              <Link
                href="/inscription"
                className="group inline-flex h-14 items-center gap-3 rounded-full bg-[var(--gold-soft)] px-8 text-[13px] font-bold uppercase tracking-[0.18em] text-[var(--emerald-deep)] shadow-[0_14px_32px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:bg-[var(--gold)] sm:h-16 sm:px-10 sm:text-[14px]"
              >
                Commencer mon inscription
                <ArrowRight className="size-4 transition group-hover:translate-x-1 sm:size-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[var(--paper-deep)]">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col items-center gap-2 px-4 py-10 text-center text-[11px] text-[var(--ink-fade)] sm:px-8 sm:py-12">
          <Image src={brand.logoSrc} alt="" width={64} height={64} className="size-14 opacity-80 sm:size-16" />
          <div
            className="font-serif text-[14px] text-[var(--emerald-deep)]"
            style={{ fontFamily: "var(--font-arabic), serif", direction: "rtl" }}
          >
            وَفَّقَكُمُ اللهُ
          </div>
          <div>{brand.name}</div>
          <div className="opacity-60">© 2026 · {prof.name}</div>
        </div>
      </footer>

      {/* STICKY MOBILE CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line-soft)] bg-[var(--paper)]/95 px-4 py-3 backdrop-blur sm:hidden">
        <Link
          href="/inscription"
          className="flex h-12 w-full items-center justify-center rounded-full bg-[var(--emerald)] text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--gold-soft)]"
        >
          S&apos;inscrire à l&apos;institut
        </Link>
      </div>
    </main>
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
        <div className="font-serif text-[15px] text-[var(--paper-cream)]">{name}</div>
        <div className="mt-0.5 text-[12px] text-[var(--paper-cream)]/70">{handle}</div>
      </div>
      <ArrowRight className="size-4 text-[var(--gold-soft)] transition group-hover:translate-x-1" />
    </a>
  );
}
