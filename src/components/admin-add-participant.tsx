"use client";

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Plus, UserPlus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AdminRegistrationFields } from "@/components/admin-registration-fields";
import {
  adminRegistrationSchema,
  normalizeAdminPayload,
  type AdminRegistrationInput,
} from "@/lib/schemas/admin-registration";
import type { Database } from "@/lib/types/db";

type Seminar = Database["public"]["Tables"]["seminars"]["Row"];

export function AdminAddParticipant({
  seminars,
  tenant,
}: {
  seminars: Seminar[];
  tenant: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSaving, startSaving] = useTransition();

  useEffect(() => setMounted(true), []);

  const form = useForm<AdminRegistrationInput>({
    resolver: zodResolver(adminRegistrationSchema),
    mode: "onBlur",
    defaultValues: {
      seminar_id: "",
      first_name: "",
      last_name: "",
      email: "",
      telegram_handle: "",
      zoom_email: "",
      gender: "homme",
      payment_method: "paypal",
      payment_status: "pending",
      installment_count: "",
      installment_first_date: "",
      installment_dates: [],
      notes: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const onSubmit = form.handleSubmit((data) => {
    startSaving(async () => {
      const supabase = createClient();
      const payload = normalizeAdminPayload(data);
      const { error } = await supabase
        .from("registrations")
        .insert({ ...payload, tenant });
      if (error) {
        toast.error("Échec de l'ajout.");
        return;
      }
      toast.success("Participant ajouté.");
      form.reset();
      setOpen(false);
      router.refresh();
    });
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#202819] px-4 text-sm font-medium text-[#fbefdf] shadow-[0_8px_18px_rgba(32,40,25,0.18)] transition hover:bg-[#3c4130] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#546b43]/40 sm:w-auto"
      >
        <UserPlus className="size-4" />
        Ajouter
      </button>

      {mounted && open
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Ajouter un participant"
              className="fixed inset-0 z-[9999] flex items-end justify-center bg-[#0e0a06]/55 backdrop-blur-sm sm:items-center sm:p-6"
              onClick={() => setOpen(false)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-[#fbefdf] shadow-[0_-20px_50px_rgba(0,0,0,0.35)] sm:max-h-full sm:rounded-2xl sm:shadow-[0_30px_60px_rgba(0,0,0,0.35)]"
              >
                <header className="flex items-start justify-between gap-3 border-b border-[#d6cfc0] bg-[#f2eadf] px-4 py-3.5 sm:px-5 sm:py-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#546b43]">
                      Nouveau participant
                    </p>
                    <h2 className="mt-0.5 font-display text-lg text-[#202819] sm:text-xl">
                      Ajouter manuellement
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Fermer"
                    className="inline-flex size-11 items-center justify-center rounded-lg border border-[#cdc5b3] bg-[#fbefdf] text-[#3c4130] transition hover:border-[#546b43] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#546b43]/40"
                  >
                    <X className="size-5" />
                  </button>
                </header>

                <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
                  <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
                    <AdminRegistrationFields
                      control={form.control}
                      errors={form.formState.errors}
                      seminars={seminars}
                    />
                  </div>
                  <footer className="flex flex-col-reverse gap-2.5 border-t border-[#d6cfc0] bg-[#f2eadf] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-end sm:px-5 sm:py-4">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      disabled={isSaving}
                      className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-[#cdc5b3] bg-[#fbefdf] px-4 text-sm font-medium text-[#3c4130] transition hover:border-[#546b43] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#546b43]/40 disabled:opacity-50 sm:w-auto"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#202819] px-5 text-sm font-medium text-[#fbefdf] shadow-[0_10px_22px_rgba(32,40,25,0.18)] transition hover:bg-[#3c4130] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#546b43]/40 disabled:opacity-60 sm:w-auto"
                    >
                      {isSaving ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Plus className="size-4" />
                      )}
                      Ajouter
                    </button>
                  </footer>
                </form>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
