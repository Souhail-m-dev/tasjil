"use client";

import { useMemo, useState } from "react";
import { Search, NotebookPen } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminRegistrationDrawer } from "@/components/admin-registration-drawer";
import { AdminAddParticipant } from "@/components/admin-add-participant";
import { RegistrationStatusSelect } from "@/components/registration-status-select";
import {
  paymentStatuses,
  paymentStatusLabels,
  type PaymentStatus,
} from "@/lib/schemas/admin-registration";
import type { Database } from "@/lib/types/db";

type Registration = Database["public"]["Tables"]["registrations"]["Row"] & {
  seminars?: Database["public"]["Tables"]["seminars"]["Row"] | null;
};
type Seminar = Database["public"]["Tables"]["seminars"]["Row"];

type StatusFilter = PaymentStatus | "all";

export function AdminRegistrationsTable({
  registrations,
  seminars,
}: {
  registrations: Registration[];
  seminars: Seminar[];
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selected, setSelected] = useState<Registration | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return registrations.filter((r) => {
      if (statusFilter !== "all" && r.payment_status !== statusFilter) return false;
      if (!q) return true;
      const hay = [
        r.first_name,
        r.last_name,
        r.email,
        r.seminars?.title,
        r.payment_method,
        r.notes,
        r.telegram_handle,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [registrations, query, statusFilter]);

  return (
    <section className="overflow-hidden rounded-2xl border border-[#d6cfc0] bg-[#fbefdf] shadow-[0_14px_28px_rgba(32,40,25,0.06)]">
      <div className="border-b border-[#d6cfc0] bg-[#f2eadf] px-4 py-4 sm:px-5 sm:py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#546b43] sm:text-[11px] sm:tracking-[0.28em]">
              Inscriptions
            </p>
            <p className="mt-0.5 font-serif text-base text-[#202819] sm:text-lg">
              {filtered.length} / {registrations.length} entrée{registrations.length > 1 ? "s" : ""}
            </p>
          </div>
          <AdminAddParticipant seminars={seminars} />
        </div>

        <div className="mt-3 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#98927f]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher : nom, email, séminaire, note…"
              className="h-11 w-full rounded-lg border border-[#cdc5b3] bg-[#fbefdf] pl-9 pr-3 text-base text-[#202819] placeholder:text-[#98927f] focus:border-[#546b43] focus:outline-none focus:ring-2 focus:ring-[#546b43]/25 sm:text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            <FilterChip
              active={statusFilter === "all"}
              onClick={() => setStatusFilter("all")}
            >
              Tous
            </FilterChip>
            {paymentStatuses.map((s) => (
              <FilterChip
                key={s}
                active={statusFilter === s}
                onClick={() => setStatusFilter(s)}
              >
                {paymentStatusLabels[s]}
              </FilterChip>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="divide-y divide-[#e6ddca] md:hidden">
        {filtered.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setSelected(r)}
            className="block w-full px-4 py-3 text-left transition hover:bg-[#f7eedd]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-serif text-[15px] text-[#202819]">
                  {r.first_name} {r.last_name}
                </p>
                <p className="truncate text-[12px] text-[#3c4130]">{r.email}</p>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <RegistrationStatusSelect
                  registrationId={r.id}
                  initialStatus={r.payment_status ?? "pending"}
                />
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#5e6353]">
              <span className="truncate">{r.seminars?.title ?? "—"}</span>
              <span>·</span>
              <span>{r.payment_method ?? "—"}</span>
              {r.created_at && (
                <>
                  <span>·</span>
                  <span>{new Date(r.created_at).toLocaleDateString("fr-FR")}</span>
                </>
              )}
              {r.notes && (
                <span className="inline-flex items-center gap-1 text-[#546b43]">
                  <NotebookPen className="size-3" />
                  note
                </span>
              )}
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
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
              <th className="px-5 py-3">Paiement</th>
              <th className="px-5 py-3">Statut</th>
              <th className="px-5 py-3">Notes</th>
              <th className="px-5 py-3">Créé le</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr
                key={r.id}
                onClick={() => setSelected(r)}
                className="cursor-pointer border-t border-[#e6ddca] transition hover:bg-[#f7eedd]"
              >
                <td className="px-5 py-3 font-serif text-[#202819]">
                  {r.first_name} {r.last_name}
                </td>
                <td className="px-5 py-3 text-[#3c4130]">{r.email}</td>
                <td className="max-w-[16rem] truncate px-5 py-3 text-[#3c4130]">
                  {r.seminars?.title ?? "—"}
                </td>
                <td className="px-5 py-3 text-[#3c4130]">{r.payment_method ?? "—"}</td>
                <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                  <RegistrationStatusSelect
                    registrationId={r.id}
                    initialStatus={r.payment_status ?? "pending"}
                  />
                </td>
                <td className="px-5 py-3 text-[#3c4130]">
                  {r.notes ? (
                    <span className="inline-flex items-center gap-1 text-[12px] text-[#546b43]">
                      <NotebookPen className="size-3.5" />
                      <span className="max-w-[10rem] truncate">{r.notes}</span>
                    </span>
                  ) : (
                    <span className="text-[#98927f]">—</span>
                  )}
                </td>
                <td className="px-5 py-3 text-xs text-[#5e6353]">
                  {r.created_at
                    ? new Date(r.created_at).toLocaleDateString("fr-FR")
                    : "—"}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-sm text-[#5e6353]"
                >
                  Aucune inscription.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminRegistrationDrawer
        registration={selected}
        seminars={seminars}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center rounded-full border px-3 text-[12px] font-medium uppercase tracking-[0.10em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#546b43]/40",
        active
          ? "border-[#546b43] bg-[#546b43] text-[#fbefdf]"
          : "border-[#cdc5b3] bg-[#fbefdf] text-[#3c4130] hover:border-[#546b43]",
      )}
    >
      {children}
    </button>
  );
}
