import Link from "next/link";
import { ArrowRight, NotebookPen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import {
  paymentStatusLabels,
  type PaymentStatus,
} from "@/lib/schemas/admin-registration";

export const metadata = {
  title: "Tableau de bord — Administration",
};

const RECENT_LIMIT = 5;

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [{ data: registrations }, { data: seminars }] = await Promise.all([
    supabase
      .from("registrations")
      .select("*, seminars(title)")
      .order("created_at", { ascending: false }),
    supabase.from("seminars").select("*").order("start_date", { ascending: true }),
  ]);

  const totalRegistrations = registrations?.length ?? 0;
  const paidCount =
    registrations?.filter((r) => r.payment_status === "paid").length ?? 0;
  const pendingCount = totalRegistrations - paidCount;

  const seminarStats =
    seminars?.map((s) => ({
      title: s.title,
      count: registrations?.filter((r) => r.seminar_id === s.id).length ?? 0,
      revenue:
        (s.price_eur ?? 0) *
        (registrations?.filter(
          (r) => r.seminar_id === s.id && r.payment_status === "paid",
        ).length ?? 0),
    })) ?? [];

  const recent = (registrations ?? []).slice(0, RECENT_LIMIT);

  return (
    <div className="flex flex-col gap-5 sm:gap-8">
      <header className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[#546b43] sm:text-[11px] sm:tracking-[0.32em]">
          Vue d&apos;ensemble
        </p>
        <h1 className="mt-1.5 font-display text-2xl text-[#202819] sm:mt-2 sm:text-4xl lg:text-5xl">
          Tableau de bord
        </h1>
      </header>

      <section className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Total inscrits" value={totalRegistrations} />
        <StatCard label="Confirmés" value={paidCount} accent />
        <StatCard label="En attente" value={pendingCount} />
        <StatCard label="Séminaires" value={seminars?.length ?? 0} />
      </section>

      <section className="grid gap-3 sm:gap-4 md:grid-cols-2">
        {seminarStats.map((s) => (
          <div
            key={s.title}
            className="rounded-xl border border-[#d6cfc0] bg-[#fbefdf] p-4 shadow-[0_12px_24px_rgba(32,40,25,0.05)] sm:p-5"
          >
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#546b43] sm:text-[11px] sm:tracking-[0.28em]">
              Séminaire
            </p>
            <p className="mt-1 line-clamp-2 font-serif text-[15px] text-[#202819] sm:text-lg">
              {s.title}
            </p>
            <div className="mt-3 flex items-end justify-between gap-3 sm:mt-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#5e6353] sm:text-xs sm:tracking-[0.18em]">
                  Inscrits
                </p>
                <p className="font-display text-2xl text-[#202819] sm:text-3xl">
                  {s.count}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#5e6353] sm:text-xs sm:tracking-[0.18em]">
                  Encaissé
                </p>
                <p className="font-serif text-base text-[#546b43] sm:text-lg">
                  {formatPrice(s.revenue)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#d6cfc0] bg-[#fbefdf] shadow-[0_14px_28px_rgba(32,40,25,0.06)]">
        <div className="flex flex-col gap-2 border-b border-[#d6cfc0] bg-[#f2eadf] px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:px-5">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#546b43] sm:text-[11px] sm:tracking-[0.28em]">
              Inscriptions récentes
            </p>
            <p className="mt-0.5 font-serif text-base text-[#202819] sm:text-lg">
              {recent.length} dernière{recent.length > 1 ? "s" : ""} sur {totalRegistrations}
            </p>
          </div>
          <Link
            href="/admin/inscriptions"
            className="inline-flex h-10 items-center gap-1.5 self-start rounded-lg border border-[#546b43] bg-[#546b43] px-3 text-[12px] font-medium uppercase tracking-[0.14em] text-[#fbefdf] transition hover:bg-[#3f5333] sm:self-auto"
          >
            Voir tout
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Mobile cards */}
        <div className="divide-y divide-[#e6ddca] md:hidden">
          {recent.map((r) => (
            <div key={r.id} className="px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-serif text-[15px] text-[#202819]">
                    {r.first_name} {r.last_name}
                  </p>
                  <p className="truncate text-[12px] text-[#3c4130]">{r.email}</p>
                </div>
                <StatusBadge status={(r.payment_status ?? "pending") as PaymentStatus} />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#5e6353]">
                <span className="truncate">{r.seminars?.title ?? "—"}</span>
                {r.created_at && (
                  <>
                    <span>·</span>
                    <span>
                      {new Date(r.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </>
                )}
                {r.notes && (
                  <span className="inline-flex items-center gap-1 text-[#546b43]">
                    <NotebookPen className="size-3" />
                    note
                  </span>
                )}
              </div>
            </div>
          ))}
          {recent.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-[#5e6353]">
              Aucune inscription.
            </p>
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f2eadf] text-[11px] uppercase tracking-[0.18em] text-[#5e6353]">
              <tr>
                <th className="px-5 py-3">Nom</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Séminaire</th>
                <th className="px-5 py-3">Statut</th>
                <th className="px-5 py-3">Créé le</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.id} className="border-t border-[#e6ddca]">
                  <td className="px-5 py-3 font-serif text-[#202819]">
                    {r.first_name} {r.last_name}
                  </td>
                  <td className="px-5 py-3 text-[#3c4130]">{r.email}</td>
                  <td className="max-w-[18rem] truncate px-5 py-3 text-[#3c4130]">
                    {r.seminars?.title ?? "—"}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge
                      status={(r.payment_status ?? "pending") as PaymentStatus}
                    />
                  </td>
                  <td className="px-5 py-3 text-xs text-[#5e6353]">
                    {r.created_at
                      ? new Date(r.created_at).toLocaleDateString("fr-FR")
                      : "—"}
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-sm text-[#5e6353]"
                  >
                    Aucune inscription.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-xl border p-3.5 shadow-[0_10px_20px_rgba(32,40,25,0.05)] sm:p-5"
      style={{
        borderColor: accent ? "#546b43" : "#d6cfc0",
        background: accent ? "#e4d4b7" : "#fbefdf",
      }}
    >
      <p className="text-[10px] uppercase tracking-[0.22em] text-[#546b43] sm:text-[11px] sm:tracking-[0.28em]">
        {label}
      </p>
      <p className="mt-1.5 font-display text-2xl text-[#202819] sm:mt-2 sm:text-4xl">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  const styles: Record<PaymentStatus, string> = {
    paid: "border-[#546b43] bg-[#e4d4b7] text-[#3f5333]",
    pending: "border-[#cdc5b3] bg-[#f2eadf] text-[#5e6353]",
    cancelled: "border-[#c8a99a] bg-[#f2dcd2] text-[#7a3a2a]",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.10em] ${styles[status] ?? styles.pending}`}
    >
      {paymentStatusLabels[status] ?? status}
    </span>
  );
}
