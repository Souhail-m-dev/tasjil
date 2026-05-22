import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { teacher } from "@/lib/seminar-display";
import { InscriptionButton } from "@/components/inscription-button";
import { BookSpread } from "@/components/book-spread";

const blurbs: Record<string, string> = {
  "hisn-al-muslim":
    "Les invocations prophétiques du quotidien, expliquées une à une — du réveil au coucher, des épreuves aux joies. Une lecture mot à mot de la forteresse du musulman, pour ancrer le dhikr dans la vie de tous les jours.",
  "beaux-noms-allah":
    "Connaître Allah par Ses noms. Une lecture rigoureuse du résumé du Shaykh Abd Ar-Razzâq al-Badr : chaque nom, sa preuve dans le Livre et la Sunna, son sens, son effet sur le cœur et sur l'adoration.",
  "asma-al-husna-resume":
    "Connaître Allah par Ses noms. Une lecture rigoureuse du résumé du Shaykh Abd Ar-Razzâq al-Badr : chaque nom, sa preuve dans le Livre et la Sunna, son sens, son effet sur le cœur et sur l'adoration.",
};

function Ornament() {
  return (
    <div className="flex items-center justify-center gap-4 py-14 sm:py-20">
      <span className="h-px w-16 bg-[#546b43]/30 sm:w-24" />
      <span className="text-[#546b43] text-sm" aria-hidden>
        ◆
      </span>
      <span className="h-px w-16 bg-[#546b43]/30 sm:w-24" />
    </div>
  );
}

export default async function Landing() {
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

  return (
    <main className="min-h-screen bg-[#fbefdf] text-[#202819]">
      {/* 1. Ouverture */}
      <section className="relative">
        <div className="mx-auto w-full max-w-[1180px] px-4 py-20 sm:px-8 sm:py-28">
          <div className="max-w-[760px]">
            <p className="flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-[#546b43] sm:text-[11px]">
              <span className="h-px w-10 bg-[#546b43]/50" />
              Été 2026 · Deux séminaires
            </p>

            <h1 className="mt-8 font-display text-[2.4rem] leading-[1.02] text-[#202819] sm:text-[3.6rem] lg:text-[4.2rem]">
              Comprendre
              <br />
              la parole d&apos;Allah
              <br />
              <em className="font-serif italic text-[#546b43]">
                et la sagesse de Son messager.
              </em>
            </h1>

            <p className="mt-8 max-w-[46ch] font-serif text-[16px] italic leading-[1.55] text-[#3c4130] sm:text-[18px]">
              Deux livres, un docteur de Médine, dix-huit semaines sur Zoom.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <InscriptionButton size="lg" />
              <Link
                href="#tome-1"
                className="text-[12px] uppercase tracking-[0.28em] text-[#202819] underline-offset-[10px] hover:underline sm:text-[13px]"
              >
                ↓ Le programme
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Ornament />

      {/* 2. Le maître */}
      <section>
        <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[auto_1fr] lg:gap-16">
            <div className="flex justify-start lg:justify-center">
              <div className="rounded-full border border-[#546b43]/35 p-3">
                <Image
                  src={teacher.logoSrc}
                  alt={`Logo ${teacher.name}`}
                  width={88}
                  height={88}
                  className="h-20 w-20 object-contain"
                />
              </div>
            </div>

            <div className="max-w-[640px]">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#546b43] sm:text-[11px]">
                Le maître
              </p>
              <h2 className="mt-3 font-display text-[1.6rem] text-[#202819] sm:text-[2rem]">
                {teacher.name}
              </h2>

              <p className="mt-6 font-serif text-[16px] leading-[1.8] text-[#3c4130] sm:text-[17px]">
                <span className="float-left mr-3 mt-1 font-display text-[5rem] leading-[0.85] text-[#546b43] sm:text-[6rem]">
                  D
                </span>
                iplômé d&apos;un doctorat en théologie islamique à l&apos;université
                islamique de Médine, le docteur AbdelRahman Abu Abdelwahab transmet
                la science traditionnelle en français avec rigueur, clarté et
                adab.
              </p>

              <ul className="mt-10 divide-y divide-[#546b43]/20 border-y border-[#546b43]/20">
                <li className="grid grid-cols-[140px_1fr] gap-4 py-4 sm:grid-cols-[180px_1fr]">
                  <span className="text-[10px] uppercase tracking-[0.28em] text-[#546b43]">
                    Formation
                  </span>
                  <span className="font-serif text-[15px] text-[#202819] sm:text-[16px]">
                    Université islamique de Médine
                  </span>
                </li>
                <li className="grid grid-cols-[140px_1fr] gap-4 py-4 sm:grid-cols-[180px_1fr]">
                  <span className="text-[10px] uppercase tracking-[0.28em] text-[#546b43]">
                    Spécialité
                  </span>
                  <span className="font-serif text-[15px] text-[#202819] sm:text-[16px]">
                    ʿAqīda, fiqh, tafsīr
                  </span>
                </li>
                <li className="grid grid-cols-[140px_1fr] gap-4 py-4 sm:grid-cols-[180px_1fr]">
                  <span className="text-[10px] uppercase tracking-[0.28em] text-[#546b43]">
                    Langue
                  </span>
                  <span className="font-serif text-[15px] text-[#202819] sm:text-[16px]">
                    Cours en français
                  </span>
                </li>
              </ul>

              <p className="mt-6 text-[12px] uppercase tracking-[0.24em] text-[#546b43]">
                Pour toute question ·{" "}
                <a
                  href="https://t.me/drabderahman"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:text-[#202819] hover:underline"
                >
                  Telegram @drabderahman
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Ornament />

      {/* 3. Tome I */}
      {first && (
        <BookSpread
          seminar={first}
          side="left"
          tomeNumber={1}
          blurb={blurbs[first.slug] ?? ""}
        />
      )}

      {/* 4. Tome II */}
      {second && (
        <BookSpread
          seminar={second}
          side="right"
          tomeNumber={2}
          blurb={blurbs[second.slug] ?? ""}
        />
      )}

      <Ornament />

      {/* 5. La discipline */}
      <section>
        <div className="mx-auto w-full max-w-[1180px] px-4 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-[640px] text-center">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#546b43] sm:text-[11px]">
              La discipline
            </p>
            <p className="mt-6 font-serif text-[16px] leading-[1.75] text-[#3c4130] sm:text-[18px]">
              Chaque semaine, un majlis. Le cours est diffusé en direct sur Zoom,
              enregistré, puis accompagné de notes structurées et d&apos;un quiz
              pour ancrer ce qui a été étudié.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                n: "01",
                label: "Cours en direct",
                detail: "Zoom hebdomadaire, en français.",
              },
              {
                n: "02",
                label: "Notes structurées",
                detail: "Un support écrit pour suivre et réviser.",
              },
              {
                n: "03",
                label: "Replay",
                detail: "Chaque séance enregistrée, accessible librement.",
              },
              {
                n: "04",
                label: "Quiz hebdomadaire",
                detail: "Pour mesurer ce qui a été retenu.",
              },
            ].map((step, i) => (
              <div
                key={step.n}
                className={`px-5 py-6 ${i > 0 ? "border-t border-[#546b43]/20 lg:border-l lg:border-t-0" : ""} ${i === 1 ? "sm:border-l sm:border-t-0 sm:border-[#546b43]/20 lg:border-t-0" : ""}`}
              >
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#546b43]">
                  {step.n}
                </p>
                <p className="mt-3 font-display text-[1.15rem] text-[#202819] sm:text-[1.25rem]">
                  {step.label}
                </p>
                <p className="mt-2 text-[13px] leading-[1.55] text-[#5e6353] sm:text-[14px]">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Ornament />

      {/* 6. L'engagement */}
      <section className="bg-[#202819] text-[#fbefdf]">
        <div className="mx-auto w-full max-w-[1180px] px-4 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-[640px] text-center">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#e3cc9e] sm:text-[11px]">
              Inscription
            </p>
            <h2 className="mt-6 font-display text-[1.9rem] leading-[1.1] sm:text-[2.6rem]">
              Inscrivez-vous une fois,
              <br />
              suivez les deux séminaires.
            </h2>
            <p className="mt-5 font-serif text-[15px] italic leading-[1.65] text-[#fbefdf]/75 sm:text-[17px]">
              Un seul formulaire couvre les deux livres.
            </p>
            <div className="mt-10 flex justify-center">
              <InscriptionButton
                size="lg"
                className="!bg-[#fbefdf] !text-[#202819] !border-[#fbefdf] hover:!bg-[#e3cc9e] hover:!text-[#202819]"
              />
            </div>
            <p className="mt-10 text-[10px] uppercase tracking-[0.32em] text-[#e3cc9e]/80 sm:text-[11px]">
              ◆ Places ouvertes
            </p>
          </div>
        </div>
      </section>

      {/* 7. Silsila / footer */}
      <footer className="border-t border-[#546b43]/25 bg-[#fbefdf]">
        <div className="mx-auto flex h-16 w-full max-w-[1180px] items-center justify-between px-4 sm:px-8">
          <a
            href="https://t.me/drabderahman"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-[#3c4130] hover:text-[#202819] hover:underline sm:text-[13px]"
          >
            Telegram · @drabderahman
          </a>
          <span className="text-[10px] uppercase tracking-[0.32em] text-[#546b43]">
            Été 2026
          </span>
        </div>
      </footer>
    </main>
  );
}
