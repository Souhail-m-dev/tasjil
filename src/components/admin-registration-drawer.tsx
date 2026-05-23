"use client";

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Mail, Save, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { sendConfirmationEmail } from "@/app/actions/send-confirmation-email";
import { formatDate } from "@/lib/format";
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
  confirmation_email_sent_at?: string | null;
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
  const [isSendingEmail, startSendingEmail] = useTransition();
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

  const onSendEmail = () => {
    if (!registration) return;
    startSendingEmail(async () => {
      const { success } = await sendConfirmationEmail({
        registrationIds: [registration.id],
        force: true,
      });
      if (success) {
        toast.success("Email envoyé");
        router.refresh();
      } else {
        toast.error("Échec de l'envoi.");
      }
    });
  };

  const overlay = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Modifier inscription"
      className="fixed inset-0 z-[9999] flex items-end justify-end bg-[#0e0a06]/55 backdrop-blur-sm sm:items-stretch"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92dvh] w-full max-w-2xl flex-col rounded-t-2xl bg-[#fbefdf] shadow-[0_-20px_50px_rgba(0,0,0,0.35)] sm:max-h-none sm:h-full sm:rounded-none sm:shadow-[0_30px_60px_rgba(0,0,0,0.35)]"
      >
        <header className="flex items-start justify-between gap-3 border-b border-[#d6cfc0] bg-[#f2eadf] px-4 py-3.5 sm:px-5 sm:py-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#546b43]">
              Inscription
            </p>
            <h2 className="mt-0.5 truncate font-display text-lg text-[#202819] sm:text-xl">
              {registration.first_name} {registration.last_name}
            </h2>
            <p className="truncate text-[12px] text-[#5e6353]">{registration.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-[#cdc5b3] bg-[#fbefdf] text-[#3c4130] transition hover:border-[#546b43] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#546b43]/40"
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
            <EngagementBlock registration={registration} />
          </div>

          <footer className="flex flex-col-reverse gap-4 border-t border-[#d6cfc0] bg-[#f2eadf] px-4 py-3.5 sm:flex-row sm:items-end sm:justify-between sm:px-5 sm:py-4">
            <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:items-end sm:gap-3">
              <button
                type="button"
                onClick={onDelete}
                disabled={isDeleting || isSaving || isSendingEmail}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#a8321b]/40 bg-[#fbe6df] px-4 text-sm font-medium text-[#a8321b] transition hover:border-[#a8321b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a8321b]/30 disabled:opacity-50 sm:w-auto"
              >
                {isDeleting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                {confirmDelete ? "Confirmer la suppression" : "Supprimer"}
              </button>

              <div className="flex flex-col gap-1">
                {registration.confirmation_email_sent_at && (
                  <span className="px-1 text-[10px] text-[#5e6353]">
                    Dernier envoi : {formatDate(registration.confirmation_email_sent_at)}
                  </span>
                )}
                <button
                  type="button"
                  onClick={onSendEmail}
                  disabled={isSendingEmail || isSaving || isDeleting}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#cdc5b3] bg-[#fbefdf] px-4 text-sm font-medium text-[#3c4130] transition hover:border-[#546b43] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#546b43]/40 disabled:opacity-50 sm:w-auto"
                >
                  {isSendingEmail ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Mail className="size-4" />
                  )}
                  Envoyer email de confirmation
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving || isDeleting || isSendingEmail}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#202819] px-6 text-sm font-medium text-[#fbefdf] shadow-[0_10px_22px_rgba(32,40,25,0.18)] transition hover:bg-[#3c4130] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#546b43]/40 disabled:opacity-60 sm:w-auto"
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

function EngagementBlock({ registration }: { registration: Registration }) {
  const items: { label: string; checked: boolean }[] = [
    { label: "Règlement du séminaire", checked: !!registration.agreed_rules },
    { label: "Assiduité et bonne intention", checked: !!registration.agreed_attendance },
    { label: "Règlement des frais", checked: !!registration.agreed_payment },
    { label: "Exactitude des informations", checked: !!registration.agreed_truth },
  ];
  const allOk = items.every((i) => i.checked);
  const signed = !!registration.signature_text;

  if (!signed && !registration.signed_at && !allOk && items.every((i) => !i.checked)) {
    return null;
  }

  return (
    <div className="mt-5 rounded-xl border border-[#d6cfc0] bg-[#f2eadf] p-4 sm:p-5">
      <p className="text-[10px] uppercase tracking-[0.22em] text-[#546b43] sm:text-[11px]">
        Engagement & signature
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {items.map((it) => (
          <div
            key={it.label}
            className="flex items-center gap-2 text-[13px] text-[#3c4130]"
          >
            <span
              className={
                "inline-block size-2 rounded-full " +
                (it.checked ? "bg-[#546b43]" : "bg-[#cdc5b3]")
              }
            />
            {it.label}
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-2 border-t border-[#d6cfc0] pt-3 sm:grid-cols-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#5e6353]">
            Signature
          </p>
          <p className="mt-0.5 font-serif text-[14px] italic text-[#202819]">
            {registration.signature_text ?? "—"}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#5e6353]">
            Signé le
          </p>
          <p className="mt-0.5 text-[14px] text-[#202819]">
            {registration.signed_at
              ? new Date(registration.signed_at).toLocaleString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "—"}
          </p>
        </div>
      </div>
    </div>
  );
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
