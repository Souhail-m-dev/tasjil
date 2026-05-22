"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

const STATUS_OPTIONS = [
  { value: "pending", label: "En attente" },
  { value: "paid", label: "Payé" },
  { value: "cancelled", label: "Annulé" },
] as const;

type Status = (typeof STATUS_OPTIONS)[number]["value"];

export function RegistrationStatusSelect({
  registrationId,
  initialStatus,
}: {
  registrationId: string;
  initialStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<string>(initialStatus);
  const [isPending, startTransition] = useTransition();

  const onChange = (next: Status) => {
    const previous = status;
    setStatus(next);
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase
        .from("registrations")
        .update({ payment_status: next })
        .eq("id", registrationId);

      if (error) {
        setStatus(previous);
        toast.error("Échec de la mise à jour.");
        return;
      }

      toast.success("Statut mis à jour.");
      router.refresh();
    });
  };

  const bg =
    status === "paid"
      ? "#546b43"
      : status === "cancelled"
        ? "#a8321b"
        : "#e3cc9e";
  const fg = status === "pending" ? "#3c4130" : "#fbefdf";

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => onChange(e.target.value as Status)}
      className="h-8 rounded-full border border-transparent px-3 text-[11px] font-medium uppercase tracking-[0.12em] transition focus:outline-none focus:ring-2 focus:ring-[#546b43]/30 disabled:opacity-60"
      style={{ background: bg, color: fg }}
    >
      {STATUS_OPTIONS.map((o) => (
        <option key={o.value} value={o.value} style={{ color: "#202819", background: "#fbefdf" }}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
