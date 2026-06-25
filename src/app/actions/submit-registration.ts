"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { getTenant } from "@/lib/tenants";
import { sendConfirmationEmail } from "@/app/actions/send-confirmation-email";
import {
  BOTH_SEMINARS_OPTION_ID,
  normalizeRegistration,
  makeRegistrationSchema,
  type RegistrationInput,
} from "@/lib/schemas/registration";

type SubmitResult =
  | { ok: true; redirect: { seminar: string; payment: string; name: string } }
  | { ok: false; error: string };

export async function submitRegistration(
  input: RegistrationInput,
): Promise<SubmitResult> {
  if (!supabaseAdmin) {
    return { ok: false, error: "Configuration serveur manquante." };
  }

  const tenantConfig = await getTenant();
  const tenant = tenantConfig.slug;
  const parsed = makeRegistrationSchema({
    payment: tenantConfig.features.payment,
  }).safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Données invalides." };
  }
  const data = parsed.data;
  const payload = normalizeRegistration(data);
  const isBundle = data.seminar_id === BOTH_SEMINARS_OPTION_ID;

  let inserts: (typeof payload & {
    seminar_id: string;
    payment_status: string;
    tenant: string;
    notes?: string;
  })[];

  if (isBundle) {
    const { data: seminars, error: seminarsError } = await supabaseAdmin
      .from("seminars")
      .select("id, slug, start_date")
      .eq("tenant", tenant)
      .order("start_date", { ascending: true });
    if (seminarsError || !seminars || seminars.length === 0) {
      console.error("[submitRegistration] seminars fetch", seminarsError);
      return { ok: false, error: "Séminaires introuvables." };
    }
    inserts = seminars.map((s) => ({
      ...payload,
      seminar_id: s.id,
      payment_status: "pending",
      tenant,
      notes: "Inscription pack 2 séminaires - tarif 250€.",
    }));
  } else {
    const { data: seminar, error: seminarError } = await supabaseAdmin
      .from("seminars")
      .select("id")
      .eq("id", data.seminar_id)
      .eq("tenant", tenant)
      .single();
    if (seminarError || !seminar) {
      return { ok: false, error: "Séminaire introuvable." };
    }
    inserts = [{ ...payload, payment_status: "pending", tenant }];
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
      payment: data.payment_method ?? "",
      name: data.first_name,
    },
  };
}
