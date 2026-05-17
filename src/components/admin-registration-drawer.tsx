"use client";

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Save, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AdminRegistrationFields } from "@/components/admin-registration-fields";
import {
  adminRegistrationSchema,
  normalizeAdminPayload,
  type AdminRegistrationInput,
  type PaymentStatus,
} from "@/lib/schemas/admin-registration";
import type { Database } from "@/lib/types/db";

type Registration = Database["public"]["Tables"]["registrations"]["Row"] & {
  seminars?: Database["public"]["Tables"]["seminars"]["Row"] | null;
};
type Seminar = Database["public"]["Tables"]["seminars"]["Row"];

export function AdminRegistrationDrawer({
  registration,
  seminars,
  open,
  onClose,
}: {
  registration: Registration | null;
  seminars: Seminar[];
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSaving, startSaving] = useTransition();
  const [isDeleting, startDeleting] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => setMounted(true), []);

  const form = useForm<AdminRegistrationInput>({
    resolver: zodResolver(adminRegistrationSchema),
    mode: "onBlur",
    defaultValues: emptyDefaults(),
  });

  useEffect(() => {
    if (registration) {
      form.reset({
        seminar_id: registration.seminar_id ?? "",
        first_name: registration.first_name,
        last_name: registration.last_name,
        email: registration.email,
        telegram_handle: registration.telegram_handle ?? "",
        zoom_email: registration.zoom_email ?? "",
        gender: (registration.gender ?? "homme") as AdminRegistrationInput["gender"],
        payment_method: (registration.payment_method ?? "paypal") as AdminRegistrationInput["payment_method"],
        payment_status: (registration.payment_status ?? "pending") as PaymentStatus,
        notes: registration.notes ?? "",
      });
      setConfirmDelete(false);
    }
  }, [registration, form]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!mounted || !open || !registration) return null;

  const onSubmit = form.handleSubmit((data) => {
    startSaving(async () => {
      const supabase = createClient();
      const payload = normalizeAdminPayload(data);
      const { error } = await supabase
        .from("registrations")
        .update(payload)
        .eq("id", registration.id);

      if (error) {
        toast.error("Échec de la mise à jour.");
        return;
      }
      toast.success("Inscription mise à jour.");
      router.refresh();
      onClose();
    });
  });

  const onDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    startDeleting(async () => {
      const supabase = createClient();
      const { error } = await supabase
        .from("registrations")
        .delete()
        .eq("id", registration.id);
      if (error) {
        toast.error("Échec de la suppression.");
        return;
      }
      toast.success("Inscription supprimée.");
      router.refresh();
      onClose();
    });
  };

  const overlay = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Modifier inscription"
      className="fixed inset-0 z-[9999] flex justify-end bg-[#0e0a06]/55 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-2xl flex-col bg-[#fbefdf] shadow-[0_30px_60px_rgba(0,0,0,0.35)]"
      >
        <header className="flex items-start justify-between gap-3 border-b border-[#d6cfc0] bg-[#f2eadf] px-5 py-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#546b43]">
              Inscription
            </p>
            <h2 className="mt-0.5 truncate font-display text-xl text-[#202819]">
              {registration.first_name} {registration.last_name}
            </h2>
            <p className="truncate text-[12px] text-[#5e6353]">{registration.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#cdc5b3] bg-[#fbefdf] text-[#3c4130] transition hover:border-[#546b43]"
          >
            <X className="size-4" />
          </button>
        </header>

        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <AdminRegistrationFields
              control={form.control}
              errors={form.formState.errors}
              seminars={seminars}
            />
          </div>

          <footer className="flex flex-col-reverse gap-2.5 border-t border-[#d6cfc0] bg-[#f2eadf] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <button
              type="button"
              onClick={onDelete}
              disabled={isDeleting || isSaving}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#a8321b]/40 bg-[#fbe6df] px-4 text-sm font-medium text-[#a8321b] transition hover:border-[#a8321b] disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              {confirmDelete ? "Confirmer la suppression" : "Supprimer"}
            </button>

            <button
              type="submit"
              disabled={isSaving || isDeleting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#202819] px-6 text-sm font-medium text-[#fbefdf] shadow-[0_10px_22px_rgba(32,40,25,0.18)] transition hover:bg-[#3c4130] disabled:opacity-60"
            >
              {isSaving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Enregistrer
            </button>
          </footer>
        </form>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}

function emptyDefaults(): AdminRegistrationInput {
  return {
    seminar_id: "",
    first_name: "",
    last_name: "",
    email: "",
    telegram_handle: "",
    zoom_email: "",
    gender: "homme",
    payment_method: "paypal",
    payment_status: "pending",
    notes: "",
  };
}
