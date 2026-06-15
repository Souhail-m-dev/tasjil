"use client";

import { useMemo, useState } from "react";
import { Search, NotebookPen, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminRegistrationDrawer } from "@/components/admin-registration-drawer";
import { AdminAddParticipant } from "@/components/admin-add-participant";
import { AdminBulkEmailDrawer } from "@/components/admin-bulk-email-drawer";
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

type Person = {
  key: string;
  name: string;
  email: string;
  regs: Registration[];
};

function groupByPerson(regs: Registration[]): Person[] {
  const map = new Map<string, Person>();
  for (const r of regs) {
    const key = (r.email ?? "").toLowerCase();
    let p = map.get(key);
    if (!p) {
      p = { key, name: `${r.first_name} ${r.last_name}`.trim(), email: r.email, regs: [] };
      map.set(key, p);
    }
    p.regs.push(r);
  }
  return Array.from(map.values());
}

function commonValue(values: (string | null)[]): string | null {
  const set = new Set(values.map((v) => v ?? ""));
  return set.size === 1 ? [...set][0] || null : null;
}

function latestDate(regs: Registration[]): string | null {
  const times = regs
    .map((r) => r.created_at)
    .filter(Boolean)
    .map((d) => new Date(d as string).getTime());
  if (times.length === 0) return null;
  return new Date(Math.max(...times)).toLocaleDateString("fr-FR");
}

function seminarSummary(regs: Registration[]): string {
  return regs.map((r) => r.seminars?.title ?? "—").join(" · ");
}

export function AdminRegistrationsTable({
  registrations,
  seminars,
}: {
  registrations: Registration[];
  seminars: Seminar[];
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selected, setSelected] = useState<Person | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const persons = useMemo(() => groupByPerson(registrations), [registrations]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return persons.filter((p) => {
      if (
        statusFilter !== "all" &&
        !p.regs.some((r) => (r.payment_status ?? "pending") === statusFilter)
      )
        return false;
      if (!q) return true;
      const hay = p.regs
        .flatMap((r) => [
          r.first_name,
          r.last_name,
          r.email,
          r.seminars?.title,
          r.payment_method,
          r.notes,
          r.telegram_handle,
        ])
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [persons, query, statusFilter]);

  const filteredIds = useMemo(
    () => {
      const activePersons = selectedKeys.size > 0 
        ? filtered.filter(p => selectedKeys.has(p.key))
        : filtered;
      return activePersons.flatMap((p) => p.regs.map((r) => r.id));
    },
    [filtered, selectedKeys],
  );

  const toggleAll = () => {
    if (selectedKeys.size === filtered.length) {
      setSelectedKeys(new Set());
    } else {
      setSelectedKeys(new Set(filtered.map((p) => p.key)));
    }
  };

  const toggleOne = (key: string) => {
    const next = new Set(selectedKeys);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelectedKeys(next);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-[#d6cfc0] bg-[#fbefdf] shadow-[0_14px_28px_rgba(32,40,25,0.06)]">
      <div className="border-b border-[#d6cfc0] bg-[#f2eadf] px-4 py-4 sm:px-5 sm:py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#546b43] sm:text-[11px] sm:tracking-[0.28em]">
              Inscrits
            </p>
            <p className="mt-0.5 font-serif text-base text-[#202819] sm:text-lg">
              {filtered.length} / {persons.length} personne{persons.length > 1 ? "s" : ""}
              <span className="ml-2 text-[12px] text-[#5e6353]">
                · {registrations.length} inscription{registrations.length > 1 ? "s" : ""}
                {selectedKeys.size > 0 && (
                  <span className="ml-2 font-medium text-[#546b43]">
                    ({selectedKeys.size} sélectionnée{selectedKeys.size > 1 ? "s" : ""})
                  </span>
                )}
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <AdminBulkEmailDrawer
              registrationIds={filteredIds}
              count={selectedKeys.size > 0 ? selectedKeys.size : filtered.length}
              isSelectionActive={selectedKeys.size > 0}
            />
            <AdminAddParticipant seminars={seminars} />
          </div>
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
        {filtered.map((p) => {
          const multi = p.regs.length > 1;
          const ids = p.regs.map((r) => r.id);
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => setSelected(p)}
              className="block w-full px-4 py-3 text-left transition hover:bg-[#f7eedd]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 truncate font-serif text-[15px] text-[#202819]">
                    {multi && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#546b43] px-2 py-0.5 text-[10px] font-medium text-[#fbefdf]">
                        <Layers className="size-3" />
                        {p.regs.length}
                      </span>
                    )}
                    {p.name}
                  </p>
                  <p className="truncate text-[12px] text-[#3c4130]">{p.email}</p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <RegistrationStatusSelect
                    registrationId={multi ? ids : ids[0]}
                    initialStatus={p.regs[0].payment_status ?? "pending"}
                  />
                </div>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#5e6353]">
                <span className="truncate">{seminarSummary(p.regs)}</span>
                <span>·</span>
                <span>{commonValue(p.regs.map((r) => r.payment_method)) ?? "Mixte"}</span>
                {p.regs.some((r) => r.notes) && (
                  <span className="inline-flex items-center gap-1 text-[#546b43]">
                    <NotebookPen className="size-3" />
                    note
                  </span>
                )}
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-[#5e6353]">
            Aucun inscrit.
          </p>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f2eadf] text-[11px] uppercase tracking-[0.18em] text-[#5e6353]">
            <tr>
              <th className="px-5 py-3 w-10">
                <input
                  type="checkbox"
                  checked={filtered.length > 0 && selectedKeys.size === filtered.length}
                  onChange={toggleAll}
                  className="size-4 rounded border-[#cdc5b3] bg-[#fbefdf] text-[#546b43] focus:ring-[#546b43]/25"
                />
              </th>
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
            {filtered.map((p) => {
              const multi = p.regs.length > 1;
              const ids = p.regs.map((r) => r.id);
              const method = commonValue(p.regs.map((r) => r.payment_method));
              const note = p.regs.map((r) => r.notes).find(Boolean) ?? null;
              return (
                <tr
                  key={p.key}
                  onClick={() => setSelected(p)}
                  className={cn(
                    "cursor-pointer border-t border-[#e6ddca] transition hover:bg-[#f7eedd]",
                    selectedKeys.has(p.key) && "bg-[#546b43]/5"
                  )}
                >
                  <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedKeys.has(p.key)}
                      onChange={() => toggleOne(p.key)}
                      className="size-4 rounded border-[#cdc5b3] bg-[#fbefdf] text-[#546b43] focus:ring-[#546b43]/25"
                    />
                  </td>
                  <td className="px-5 py-3 font-serif text-[#202819]">
                    <span className="flex items-center gap-2">
                      {multi && (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#546b43] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] text-[#fbefdf]">
                          <Layers className="size-3" />
                          {p.regs.length}
                        </span>
                      )}
                      {p.name}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[#3c4130]">{p.email}</td>
                  <td className="max-w-[18rem] truncate px-5 py-3 text-[#3c4130]">
                    {multi ? `${p.regs.length} séminaires` : (p.regs[0].seminars?.title ?? "—")}
                  </td>
                  <td className="px-5 py-3 text-[#3c4130]">
                    {method ?? (multi ? "Mixte" : "—")}
                  </td>
                  <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                    <RegistrationStatusSelect
                      registrationId={multi ? ids : ids[0]}
                      initialStatus={p.regs[0].payment_status ?? "pending"}
                    />
                  </td>
                  <td className="px-5 py-3 text-[#3c4130]">
                    {note ? (
                      <span className="inline-flex items-center gap-1 text-[12px] text-[#546b43]">
                        <NotebookPen className="size-3.5" />
                        <span className="max-w-[10rem] truncate">{note}</span>
                      </span>
                    ) : (
                      <span className="text-[#98927f]">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-xs text-[#5e6353]">
                    {latestDate(p.regs) ?? "—"}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="px-5 py-10 text-center text-sm text-[#5e6353]"
                >
                  Aucun inscrit.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminRegistrationDrawer
        registrations={selected?.regs ?? null}
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
