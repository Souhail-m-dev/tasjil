"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendConfirmationEmail } from "@/app/actions/send-confirmation-email";
import {
  BOTH_SEMINARS_OPTION_ID,
  normalizeRegistration,
  registrationSchema,
  type RegistrationInput,
} from "@/lib/schemas/registration";

type SubmitResult =
  | { ok: true; redirect: { seminar: string; payment: string; name: string } }
  | { ok: false; error: string };

export async function submitRegistration(
  input: RegistrationInput,
): Promise<SubmitResult> {
  const parsed = registrationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Données invalides." };
  }
  if (!supabaseAdmin) {
    return { ok: false, error: "Configuration serveur manquante." };
  }

  const data = parsed.data;
  const payload = normalizeRegistration(data);
  const isBundle = data.seminar_id === BOTH_SEMINARS_OPTION_ID;

  let inserts: (typeof payload & {
    seminar_id: string;
    payment_status: string;
    notes?: string;
  })[];

  if (isBundle) {
    const { data: seminars, error: seminarsError } = await supabaseAdmin
      .from("seminars")
      .select("id, slug, start_date")
      .order("start_date", { ascending: true });
    if (seminarsError || !seminars || seminars.length === 0) {
      console.error("[submitRegistration] seminars fetch", seminarsError);
      return { ok: false, error: "Séminaires introuvables." };
    }
    inserts = seminars.map((s) => ({
      ...payload,
      seminar_id: s.id,
      payment_status: "pending",
      notes: "Inscription pack 2 séminaires - tarif 250€.",
    }));
  } else {
    inserts = [{ ...payload, payment_status: "pending" }];
  }

  const { data: rows, error: insertError } = await supabaseAdmin
    .from("registrations")
    .insert(inserts)
    .select("id, seminar_id");

  if (insertError || !rows) {
    console.error("[submitRegistration] insert", insertError);
    return { ok: false, error: "Inscription échouée. Réessayez." };
  }

  await sendConfirmationEmail({ registrationIds: rows.map((r) => r.id) });

  let slug = "";
  if (isBundle) {
    slug = BOTH_SEMINARS_OPTION_ID;
  } else {
    const { data: seminar } = await supabaseAdmin
      .from("seminars")
      .select("slug")
      .eq("id", data.seminar_id)
      .single();
    slug = seminar?.slug ?? "";
  }

  return {
    ok: true,
    redirect: {
      seminar: slug,
      payment: data.payment_method,
      name: data.first_name,
    },
  };
}
