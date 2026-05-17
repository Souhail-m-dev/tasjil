import { createClient } from "@/lib/supabase/server";
import { formatDate, formatPrice } from "@/lib/format";

export const metadata = {
  title: "Séminaires — Administration",
};

export default async function AdminSeminairesPage() {
  const supabase = await createClient();
  const { data: seminars } = await supabase
    .from("seminars")
    .select("*")
    .order("start_date", { ascending: true });

  const rows = seminars ?? [];

  return (
    <div className="flex flex-col gap-5 sm:gap-8">
      <header className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[#546b43] sm:text-[11px] sm:tracking-[0.32em]">
          Catalogue
        </p>
        <h1 className="mt-1.5 font-display text-2xl text-[#202819] sm:mt-2 sm:text-4xl">
          Séminaires
        </h1>
        <p className="mt-1 font-serif italic text-[12px] text-[#5e6353] sm:text-sm">
          Liste en lecture seule des séminaires publiés.
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-[#d6cfc0] bg-[#fbefdf] shadow-[0_14px_28px_rgba(32,40,25,0.06)]">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f2eadf] text-[11px] uppercase tracking-[0.18em] text-[#5e6353]">
              <tr>
                <th className="px-5 py-3">Titre</th>
                <th className="px-5 py-3">Auteur</th>
                <th className="px-5 py-3">Slug</th>
                <th className="px-5 py-3">Période</th>
                <th className="px-5 py-3">Tarif</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((seminar) => (
                <tr key={seminar.id} className="border-t border-[#e6ddca]">
                  <td className="px-5 py-3 font-serif text-[#202819]">{seminar.title}</td>
                  <td className="px-5 py-3 text-[#3c4130]">{seminar.author ?? "—"}</td>
                  <td className="px-5 py-3 text-xs text-[#5e6353]">{seminar.slug}</td>
                  <td className="px-5 py-3 text-[#3c4130]">
                    {seminar.start_date && seminar.end_date
                      ? `Du ${formatDate(seminar.start_date)} au ${formatDate(seminar.end_date)}`
                      : "—"}
                  </td>
                  <td className="px-5 py-3 text-[#3c4130]">
                    {seminar.price_eur != null ? formatPrice(seminar.price_eur) : "—"}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-[#5e6353]">
                    Aucun séminaire.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-[#e6ddca] md:hidden">
          {rows.map((seminar) => (
            <div key={seminar.id} className="px-4 py-3">
              <p className="font-serif text-[15px] text-[#202819]">{seminar.title}</p>
              <p className="mt-0.5 text-[12px] text-[#3c4130]">{seminar.author ?? "—"}</p>
              <p className="mt-1 text-[11px] text-[#5e6353]">{seminar.slug}</p>
              <p className="mt-1 text-[11px] text-[#5e6353]">
                {seminar.start_date && seminar.end_date
                  ? `Du ${formatDate(seminar.start_date)} au ${formatDate(seminar.end_date)}`
                  : "Dates non définies"}
              </p>
              <p className="mt-1 text-[12px] text-[#3c4130]">
                {seminar.price_eur != null ? formatPrice(seminar.price_eur) : "Tarif non défini"}
              </p>
            </div>
          ))}
          {rows.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-[#5e6353]">Aucun séminaire.</p>
          )}
        </div>
      </section>
    </div>
  );
}
