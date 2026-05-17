import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { RegistrationForm } from "@/components/registration-form";

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
      className="relative min-h-screen w-full overflow-hidden"
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

      <Link
        href="/"
        className="fixed left-3 top-3 z-40 inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#d6cfc0] bg-[#fbefdf]/95 px-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#3c4130] shadow-[0_8px_18px_rgba(32,40,25,0.10)] backdrop-blur transition hover:border-[#546b43] hover:text-[#202819] sm:left-4 sm:top-4 sm:h-11 sm:px-4 sm:text-xs sm:tracking-[0.18em]"
      >
        <ArrowLeft className="size-4" />
        Accueil
      </Link>

      <div className="relative z-10">
        <RegistrationForm
          seminars={seminars ?? []}
          initialSeminarId={initialSeminarId}
        />
      </div>
    </main>
  );
}
