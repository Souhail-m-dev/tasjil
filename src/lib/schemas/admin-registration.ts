import { z } from "zod";
import { genders, paymentMethods } from "./registration";

export const paymentStatuses = [
  "pending",
  "paid",
  "installments",
  "pay_later",
  "offert",
  "cancelled",
] as const;
export type PaymentStatus = (typeof paymentStatuses)[number];

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: "En attente",
  paid: "Payé",
  installments: "Plusieurs fois",
  pay_later: "Payé plus tard",
  offert: "Offert",
  cancelled: "Annulé",
};

const telegramRegex = /^@?[a-zA-Z0-9_]{3,32}$/;

export const adminRegistrationSchema = z.object({
  seminar_id: z.string().trim().min(1, "Séminaire requis."),
  first_name: z.string().trim().min(1, "Prénom requis.").max(80),
  last_name: z.string().trim().min(1, "Nom requis.").max(80),
  email: z.string().trim().email("Email invalide."),
  telegram_handle: z
    .string()
    .trim()
    .max(60)
    .refine(
      (v) => v === "" || telegramRegex.test(v),
      "Identifiant Telegram invalide.",
    )
    .optional()
    .or(z.literal("")),
  zoom_email: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      "Email Zoom invalide.",
    )
    .optional()
    .or(z.literal("")),
  gender: z.enum(genders, { message: "Genre requis." }),
  payment_method: z.enum(paymentMethods, { message: "Mode de paiement requis." }),
  payment_status: z.enum(paymentStatuses),
  installment_count: z.string().trim().optional().or(z.literal("")),
  installment_first_date: z.string().trim().optional().or(z.literal("")),
  installment_dates: z.array(z.string()).optional(),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type AdminRegistrationInput = z.infer<typeof adminRegistrationSchema>;

export function normalizeAdminPayload(input: AdminRegistrationInput) {
  const isInstallments = input.payment_status === "installments";
  const count = input.installment_count
    ? parseInt(input.installment_count, 10)
    : NaN;
  const dates = (input.installment_dates ?? []).filter((d) => d && d !== "");

  return {
    seminar_id: input.seminar_id,
    first_name: input.first_name,
    last_name: input.last_name,
    email: input.email.toLowerCase(),
    telegram_handle: input.telegram_handle
      ? input.telegram_handle.startsWith("@")
        ? input.telegram_handle
        : `@${input.telegram_handle}`
      : null,
    zoom_email: input.zoom_email ? input.zoom_email.toLowerCase() : null,
    gender: input.gender,
    payment_method: input.payment_method,
    payment_status: input.payment_status,
    installment_count: isInstallments && count > 0 ? count : null,
    installment_first_date:
      isInstallments && input.installment_first_date
        ? input.installment_first_date
        : null,
    installment_dates: isInstallments && dates.length > 0 ? dates : null,
    notes: input.notes && input.notes.trim() !== "" ? input.notes.trim() : null,
  };
}
