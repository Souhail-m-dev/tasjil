"use client";

import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { Field, inputClass, labelClass } from "@/components/ui/field";
import {
  genders,
  paymentMethods,
  paymentMethodLabels,
} from "@/lib/schemas/registration";
import {
  paymentStatuses,
  paymentStatusLabels,
  type AdminRegistrationInput,
} from "@/lib/schemas/admin-registration";
import type { Database } from "@/lib/types/db";

type Seminar = Database["public"]["Tables"]["seminars"]["Row"];

const selectClass = inputClass + " appearance-none pr-8";

export function AdminRegistrationFields({
  control,
  errors,
  seminars,
}: {
  control: Control<AdminRegistrationInput>;
  errors: FieldErrors<AdminRegistrationInput>;
  seminars: Seminar[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Controller
        name="first_name"
        control={control}
        render={({ field }) => (
          <Field htmlFor="first_name" error={errors.first_name?.message}>
            <label htmlFor="first_name" className={labelClass}>
              Prénom
            </label>
            <input id="first_name" {...field} className={inputClass} />
          </Field>
        )}
      />
      <Controller
        name="last_name"
        control={control}
        render={({ field }) => (
          <Field htmlFor="last_name" error={errors.last_name?.message}>
            <label htmlFor="last_name" className={labelClass}>
              Nom
            </label>
            <input id="last_name" {...field} className={inputClass} />
          </Field>
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <Field htmlFor="email" error={errors.email?.message} className="sm:col-span-2">
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input id="email" type="email" {...field} className={inputClass} />
          </Field>
        )}
      />

      <Controller
        name="seminar_id"
        control={control}
        render={({ field }) => (
          <Field htmlFor="seminar_id" error={errors.seminar_id?.message}>
            <label htmlFor="seminar_id" className={labelClass}>
              Séminaire
            </label>
            <select id="seminar_id" {...field} className={selectClass}>
              <option value="">Choisir…</option>
              {seminars.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </Field>
        )}
      />

      <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <Field htmlFor="gender" error={errors.gender?.message}>
            <label htmlFor="gender" className={labelClass}>
              Genre
            </label>
            <select id="gender" {...field} className={selectClass}>
              <option value="">Choisir…</option>
              {genders.map((g) => (
                <option key={g} value={g}>
                  {g === "homme" ? "Homme" : "Femme"}
                </option>
              ))}
            </select>
          </Field>
        )}
      />

      <Controller
        name="payment_method"
        control={control}
        render={({ field }) => (
          <Field htmlFor="payment_method" error={errors.payment_method?.message}>
            <label htmlFor="payment_method" className={labelClass}>
              Mode de paiement
            </label>
            <select id="payment_method" {...field} className={selectClass}>
              <option value="">Choisir…</option>
              {paymentMethods.map((m) => (
                <option key={m} value={m}>
                  {paymentMethodLabels[m]}
                </option>
              ))}
            </select>
          </Field>
        )}
      />

      <Controller
        name="payment_status"
        control={control}
        render={({ field }) => (
          <Field htmlFor="payment_status" error={errors.payment_status?.message}>
            <label htmlFor="payment_status" className={labelClass}>
              Statut
            </label>
            <select id="payment_status" {...field} className={selectClass}>
              {paymentStatuses.map((s) => (
                <option key={s} value={s}>
                  {paymentStatusLabels[s]}
                </option>
              ))}
            </select>
          </Field>
        )}
      />

      <Controller
        name="telegram_handle"
        control={control}
        render={({ field }) => (
          <Field htmlFor="telegram_handle" error={errors.telegram_handle?.message}>
            <label htmlFor="telegram_handle" className={labelClass}>
              Telegram (optionnel)
            </label>
            <input
              id="telegram_handle"
              {...field}
              value={field.value ?? ""}
              placeholder="@pseudo"
              className={inputClass}
            />
          </Field>
        )}
      />

      <Controller
        name="zoom_email"
        control={control}
        render={({ field }) => (
          <Field htmlFor="zoom_email" error={errors.zoom_email?.message}>
            <label htmlFor="zoom_email" className={labelClass}>
              Email Zoom (optionnel)
            </label>
            <input
              id="zoom_email"
              type="email"
              {...field}
              value={field.value ?? ""}
              className={inputClass}
            />
          </Field>
        )}
      />

      <Controller
        name="notes"
        control={control}
        render={({ field }) => (
          <Field htmlFor="notes" error={errors.notes?.message} className="sm:col-span-2">
            <label htmlFor="notes" className={labelClass}>
              Notes internes
            </label>
            <textarea
              id="notes"
              {...field}
              value={field.value ?? ""}
              rows={4}
              placeholder="Remarques, suivi, à rappeler…"
              className={inputClass + " resize-y"}
            />
          </Field>
        )}
      />
    </div>
  );
}
