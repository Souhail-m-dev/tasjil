"use client";

import { useEffect, useState } from "react";
import { CornerFlourish } from "@/components/ui/corner-flourish";

const AR =
  "« مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ »";
const FR =
  "« Celui qui emprunte un chemin pour y chercher une connaissance, Allah lui facilitera par cela un chemin vers le Paradis. »";
const SOURCE = "Rapporté par Abû Hurayra — Sahîh Muslim n° 2699";

const STEP_MS = 35;

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export function HadithHero() {
  const maxLen = Math.max(AR.length, FR.length);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setN(maxLen);
      return;
    }
    if (n >= maxLen) return;
    const id = setTimeout(() => setN((x) => x + 1), STEP_MS);
    return () => clearTimeout(id);
  }, [n, maxLen]);

  const ar = AR.slice(0, n);
  const fr = FR.slice(0, n);
  const done = n >= maxLen;

  return (
    <div className="relative flex min-h-[540px] flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--emerald)] to-[var(--emerald-deep)] p-8 text-[var(--gold-soft)]">
      <CornerFlourish color="var(--gold)" />

      <div className="text-[10px] uppercase tracking-[0.32em] text-[var(--gold)]">
        Hadîth
      </div>

      <div className="my-auto flex flex-col gap-7 py-4">
        <p
          dir="rtl"
          className="text-center leading-[1.85] text-[var(--gold-soft)]"
          style={{
            fontFamily: "var(--font-arabic), serif",
            fontSize: "clamp(1.3rem, 2vw, 1.7rem)",
          }}
        >
          {ar}
          {!done && (
            <span className="ml-1 inline-block h-[1.1em] w-[2px] translate-y-1 animate-pulse bg-[var(--gold)]/80 align-middle" />
          )}
        </p>

        <p className="text-center font-serif italic leading-[1.6] text-[var(--paper-cream)]/85"
          style={{ fontSize: "clamp(0.95rem, 1.1vw, 1.05rem)" }}
        >
          {fr}
          {!done && (
            <span className="ml-1 inline-block h-[1em] w-[2px] translate-y-0.5 animate-pulse bg-[var(--gold)]/70 align-middle" />
          )}
        </p>
      </div>

      <div
        className={
          "text-center text-[10px] uppercase tracking-[0.18em] text-[var(--gold)]/70 transition-opacity duration-700 " +
          (done ? "opacity-100" : "opacity-0")
        }
      >
        {SOURCE}
      </div>
    </div>
  );
}
