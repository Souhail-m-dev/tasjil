import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { RegistrationForm } from "@/components/registration-form";
import { teacher } from "@/lib/seminar-display";

export const metadata = {
  title: "Inscription — Séminaires",
};

export default async function InscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ seminar?: string }>;
}) {
  const { seminar: slug } = await searchParams;
  const supabase = await createClient();
  const { data: seminars, error } = await supabase
    .from("seminars")
    .select("*")
    .order("start_date", { ascending: true });

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f2eadf] p-6">
        <p className="text-center text-sm text-[#a8321b]">
          Erreur Supabase : {error.message}
        </p>
      </main>
    );
  }

  const initialSeminarId = slug
    ? seminars?.find((s) => s.slug === slug)?.id
    : undefined;

  return (
    <main
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #f2eadf 0%, #e9e1d2 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'><path d='M120 24l36 20v40l-36 20-36-20V44zM120 104l36 20v40l-36 20-36-20v-40zM48 64l36 20v40l-36 20-36-20V84zM192 64l36 20v40l-36 20-36-20V84z' fill='none' stroke='%23546b43' stroke-width='1.2'/></svg>\")",
          backgroundSize: "200px",
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
        }}
      />

      <header className="relative z-20 flex items-center justify-between gap-3 border-b border-[#d6cfc0] bg-[#fbefdf]/95 px-3 py-2.5 shadow-[0_6px_16px_rgba(32,40,25,0.06)] backdrop-blur sm:px-6 sm:py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src={teacher.logoSrc}
            alt={`Logo ${teacher.name}`}
            width={56}
            height={56}
            className="h-auto w-10 shrink-0 object-contain sm:w-12"
            priority
          />
          <div className="min-w-0">
            <p className="truncate text-[9px] uppercase tracking-[0.24em] text-[#546b43] sm:text-[10px]">
              {teacher.role}
            </p>
            <p className="truncate font-serif text-sm text-[#202819] sm:text-base">
              {teacher.name}
            </p>
            <p className="truncate font-display text-[13px] leading-tight text-[#3c4130] sm:text-[15px]">
              Séminaire été 2026
            </p>
          </div>
        </div>
        <Link
          href="/"
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-[#d6cfc0] bg-[#fbefdf] px-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#3c4130] transition hover:border-[#546b43] hover:text-[#202819] sm:h-11 sm:px-4 sm:text-xs sm:tracking-[0.18em]"
        >
          <ArrowLeft className="size-4" />
          Accueil
        </Link>
      </header>

      <RegistrationForm
        seminars={seminars ?? []}
        initialSeminarId={initialSeminarId}
      />
    </main>
  );
}
