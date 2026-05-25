"use client";

import { Controller, useWatch, type Control, type FieldErrors } from "react-hook-form";
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
  combinedSeminars,
}: {
  control: Control<AdminRegistrationInput>;
  errors: FieldErrors<AdminRegistrationInput>;
  seminars: Seminar[];
  combinedSeminars?: { title: string; price?: number | null }[];
}) {
  const paymentStatus = useWatch({ control, name: "payment_status" });
  const countStr = useWatch({ control, name: "installment_count" });
  const count = Math.min(Math.max(parseInt(countStr || "0", 10) || 0, 0), 24);

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

      {combinedSeminars ? (
        <Field className="sm:col-span-2">
          <span className={labelClass}>
            Séminaires ({combinedSeminars.length})
          </span>
          <div className="rounded-xl border border-[#cdc5b3] bg-[#f2eadf] px-4 py-3">
            {combinedSeminars.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 py-0.5 text-[14px] text-[#202819]"
              >
                <span className="truncate">{s.title}</span>
                {s.price != null && (
                  <span className="shrink-0 font-medium text-[#546b43]">
                    {s.price} €
                  </span>
                )}
              </div>
            ))}
            {combinedSeminars.some((s) => s.price != null) && (
              <div className="mt-1.5 flex items-center justify-between gap-3 border-t border-[#d6cfc0] pt-1.5 text-[14px] font-semibold text-[#202819]">
                <span>Total</span>
                <span className="text-[#546b43]">
                  {combinedSeminars.reduce((sum, s) => sum + (s.price ?? 0), 0)} €
                </span>
              </div>
            )}
          </div>
        </Field>
      ) : (
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
      )}

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

      {paymentStatus === "installments" && (
        <div className="sm:col-span-2 rounded-xl border border-[#d6cfc0] bg-[#f2eadf] p-4">
          <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-[#546b43]">
            Paiement en plusieurs fois
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Controller
              name="installment_count"
              control={control}
              render={({ field }) => (
                <Field htmlFor="installment_count">
                  <label htmlFor="installment_count" className={labelClass}>
                    Nombre d&apos;échéances
                  </label>
                  <input
                    id="installment_count"
                    type="number"
                    min={1}
                    max={24}
                    {...field}
                    value={field.value ?? ""}
                    className={inputClass}
                  />
                </Field>
              )}
            />
            <Controller
              name="installment_first_date"
              control={control}
              render={({ field }) => (
                <Field htmlFor="installment_first_date">
                  <label htmlFor="installment_first_date" className={labelClass}>
                    Date 1ère échéance
                  </label>
                  <input
                    id="installment_first_date"
                    type="date"
                    {...field}
                    value={field.value ?? ""}
                    className={inputClass}
                  />
                </Field>
              )}
            />
          </div>

          {count > 0 && (
            <Controller
              name="installment_dates"
              control={control}
              render={({ field }) => (
                <div className="mt-3">
                  <p className={labelClass + " mb-1.5"}>
                    Dates des échéances prévues (optionnel)
                  </p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {Array.from({ length: count }).map((_, i) => (
                      <input
                        key={i}
                        type="date"
                        aria-label={`Échéance ${i + 1}`}
                        value={field.value?.[i] ?? ""}
                        onChange={(e) => {
                          const next = [...(field.value ?? [])];
                          next[i] = e.target.value;
                          field.onChange(next);
                        }}
                        className={inputClass}
                      />
                    ))}
                  </div>
                </div>
              )}
            />
          )}
        </div>
      )}

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
