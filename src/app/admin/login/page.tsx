import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminLoginForm } from "@/components/admin-login-form";

export const metadata = {
  title: "Espace administration — Connexion",
};

export default function AdminLoginPage() {
  return (
    <main
      className="relative min-h-screen w-full"
      style={{
        background: "linear-gradient(180deg, #f2eadf 0%, #e9e1d2 100%)",
      }}
    >
      <Link
        href="/"
        className="fixed left-3 top-3 z-40 inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#d6cfc0] bg-[#fbefdf]/95 px-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#3c4130] shadow-[0_8px_18px_rgba(32,40,25,0.10)] backdrop-blur transition hover:border-[#546b43] hover:text-[#202819] sm:left-4 sm:top-4 sm:h-11 sm:px-4 sm:text-xs sm:tracking-[0.18em]"
      >
        <ArrowLeft className="size-4" />
        Accueil
      </Link>

      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-16 sm:py-12">
        <div className="w-full rounded-2xl border border-[#d6cfc0] bg-[#fbefdf] p-5 shadow-[0_14px_28px_rgba(32,40,25,0.08)] sm:p-7 md:p-9">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#546b43] sm:text-[11px] sm:tracking-[0.32em]">
              Espace administration
            </p>
            <h1 className="mt-2 font-display text-2xl text-[#202819] sm:text-3xl md:text-4xl">
              Connexion
            </h1>
            <p className="mt-1.5 font-serif italic text-[13px] text-[#5e6353] sm:mt-2 sm:text-sm">
              Accès réservé. Identifiez-vous pour gérer les inscriptions.
            </p>
          </div>

          <div className="mt-6 sm:mt-7">
            <AdminLoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
