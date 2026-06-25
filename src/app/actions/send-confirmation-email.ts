"use server";

import { render } from "@react-email/render";
import { resendForKey } from "@/lib/email/resend";
import { ReceivedEmail } from "@/lib/email/templates/ReceivedEmail";
import { PaymentConfirmedEmail } from "@/lib/email/templates/PaymentConfirmedEmail";
import { ReminderEmail } from "@/lib/email/templates/ReminderEmail";
import { CourseLinkEmail } from "@/lib/email/templates/CourseLinkEmail";
import { TelegramLinkEmail } from "@/lib/email/templates/TelegramLinkEmail";
import { TelegramCorrectionEmail } from "@/lib/email/templates/TelegramCorrectionEmail";
import { supabaseAdmin } from "@/lib/supabase/admin";

// Liens Telegram par séminaire (id) puis par genre.
// Seul Hisn al-Muslim a ses groupes. Le séminaire "Beaux noms d'Allah" suivra.
const SEMINAR_TELEGRAM_LINKS: Record<string, { homme: string; femme: string }> = {
  "deffdbdd-4962-4cac-86cc-b622d96c5693": {
    homme: "https://t.me/+X5hJusj5xLQxZjE0",
    femme: "https://t.me/+GsC_jwXmBtozMTk0",
  },
};

interface SendConfirmationEmailParams {
  registrationIds: string[];
  force?: boolean;
  template?: "received" | "payment" | "reminder" | "course_link" | "telegram_link" | "telegram_correction";
  courseLink?: string;
  telegramLink?: string;
  subject?: string;
  customContent?: string;
}

export async function sendConfirmationEmail({
  registrationIds,
  force = false,
  template = "received",
  courseLink,
  telegramLink,
  subject: customSubject,
  customContent,
}: SendConfirmationEmailParams) {
  try {
    console.log("--- Email Action Debug ---");
    console.log("[Env] RESEND_API_KEY:", process.env.RESEND_API_KEY ? "Defined" : "MISSING");
    console.log("[Env] EMAIL_FROM:", process.env.EMAIL_FROM ? "Defined" : "MISSING");
    console.log("[Env] SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "Defined" : "MISSING");

    if (!supabaseAdmin) {
      console.error("[Email] supabaseAdmin not initialized");
      return { success: false, error: "Database configuration error" };
    }

    console.log(`[Email] Sending for ${registrationIds.length} registrations`);

    const { data: registrations, error: fetchError } = await supabaseAdmin
      .from("registrations")
      .select(`
        *,
        seminars (
          title,
          price_eur
        )
      `)
      .in("id", registrationIds);

    if (fetchError) {
      console.error("[Email] Fetch error:", fetchError);
      throw fetchError;
    }
    if (!registrations || registrations.length === 0) {
      console.warn("[Email] No registrations found for IDs:", registrationIds);
      return { success: false, error: "No registrations found" };
    }

    const groupedByEmail: Record<string, typeof registrations> = {};
    for (const reg of registrations) {
      if (!groupedByEmail[reg.email]) groupedByEmail[reg.email] = [];
      groupedByEmail[reg.email].push(reg);
    }

    console.log(`[Email] Grouped into ${Object.keys(groupedByEmail).length} unique emails`);
    const results = [];

    for (const [email, userRegs] of Object.entries(groupedByEmail)) {
      const firstReg = userRegs[0];
      const { data: tenantRow } = await supabaseAdmin
        .from("tenants")
        .select("resend_api_key, email_from, email_reply_to, email_from_name")
        .eq("slug", firstReg.tenant)
        .single();

      const resendKey = tenantRow?.resend_api_key ?? process.env.RESEND_API_KEY;
      if (!tenantRow || !resendKey) {
        results.push({ email, status: "failed", error: `Email config missing for tenant '${firstReg.tenant}'` });
        continue;
      }

      const resend = resendForKey(resendKey);
      const fromEmail = tenantRow.email_from;
      const fromName = tenantRow.email_from_name;
      const replyTo = tenantRow.email_reply_to;

      const now = new Date();
      const needsSending = force || userRegs.some(reg => {
        const sentAt = reg.confirmation_email_sent_at ? new Date(reg.confirmation_email_sent_at) : null;
        return !sentAt || (now.getTime() - sentAt.getTime() > 10 * 60 * 1000);
      });

      if (!needsSending) {
        console.log(`[Email] Skipping ${email} (already sent recently)`);
        results.push({ email, status: "skipped", reason: "Recently sent" });
        continue;
      }

      const seminarLines = userRegs
        .map(reg =>
          reg.seminars
            ? { title: reg.seminars.title, price: reg.seminars.price_eur ?? null }
            : null,
        )
        .filter(Boolean) as { title: string; price: number | null }[];
      const lines = seminarLines.length > 0 ? seminarLines : [{ title: "Séminaire", price: null }];

      let resolvedTelegramLink: string | null = null;
      if (template === "telegram_link") {
        const links = SEMINAR_TELEGRAM_LINKS[firstReg.seminar_id ?? ""];
        if (!links) {
          console.log(`[Email] Skipping ${email} (no Telegram link for seminar ${firstReg.seminar_id})`);
          results.push({ email, status: "skipped", reason: "No Telegram link for this seminar" });
          continue;
        }
        resolvedTelegramLink = firstReg.gender === "femme" ? links.femme : links.homme;
      }

      console.log(`[Email] Rendering ${template} template for ${email} with ${lines.length} seminars`);
      const emailHtml = await render(
        template === "payment"
          ? PaymentConfirmedEmail({
              firstName: firstReg.first_name,
              lastName: firstReg.last_name,
              seminars: lines,
            })
          : template === "reminder"
            ? ReminderEmail({
                firstName: firstReg.first_name,
                lastName: firstReg.last_name,
                seminars: lines,
                paymentMethod: firstReg.payment_method || "Non spécifié",
              })
            : template === "course_link"
              ? CourseLinkEmail({
                  firstName: firstReg.first_name,
                  seminars: lines,
                  courseLink: courseLink || "",
                  telegramLink: telegramLink,
                  customContent: customContent,
                })
            : template === "telegram_link"
              ? TelegramLinkEmail({
                  firstName: firstReg.first_name,
                  seminars: lines,
                  telegramLink: resolvedTelegramLink as string,
                })
            : template === "telegram_correction"
              ? TelegramCorrectionEmail({
                  firstName: firstReg.first_name,
                  seminars: lines,
                })
              : ReceivedEmail({
                  firstName: firstReg.first_name,
                  lastName: firstReg.last_name,
                  seminars: lines,
                  paymentMethod: firstReg.payment_method || "Non spécifié",
                })
      );

      const subject =
        customSubject ||
        (template === "payment"
          ? "Confirmation de paiement — inscription confirmée"
          : template === "reminder"
            ? "Rappel — paiement en attente pour votre inscription"
            : template === "course_link"
              ? `Lien du premier cours — ${lines[0].title}${lines.length > 1 ? " (et plus)" : ""}`
              : template === "telegram_link"
                ? "Rejoignez votre groupe Telegram dédié"
                : template === "telegram_correction"
                  ? "Information importante concernant le groupe Telegram"
                  : lines.length > 1
                  ? "Confirmation de vos inscriptions"
                  : "Confirmation de votre inscription");

      try {
        const { data, error: sendError } = await resend.emails.send({
          from: `${fromName} <${fromEmail}>`,
          to: email,
          subject,
          html: emailHtml,
          replyTo: replyTo || undefined,
          headers: {
            "X-App-Source": "SeminarRegistration",
          },
        });

        if (sendError || !data) {
          console.error(`[Email] Resend error for ${email}:`, sendError);
          results.push({ email, status: "failed", error: sendError?.message || "unknown" });
          continue;
        }

        console.log(`[Email] Resend success for ${email}. ID: ${data.id}`);

        if (template === "payment" || template === "reminder" || template === "course_link" || template === "telegram_correction") {
          results.push({ email, status: "success", messageId: data.id });
          continue;
        }

        const { error: updateError } = await supabaseAdmin
          .from("registrations")
          .update({
            confirmation_email_sent_at: new Date().toISOString(),
            confirmation_email_message_id: data.id,
          })
          .in("id", userRegs.map(r => r.id));

        if (updateError) {
          console.error(`[Email] DB Update failed for ${email}:`, updateError);
          results.push({ email, status: "partial_success", error: "Email sent but DB update failed" });
        } else {
          results.push({ email, status: "success", messageId: data.id });
        }
      } catch (sendErr) {
        const message = sendErr instanceof Error ? sendErr.message : String(sendErr);
        console.error(`[Email] Send failed for ${email}:`, sendErr);
        results.push({ email, status: "failed", error: message });
      }
    }

    return { success: true, results };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error in sendConfirmationEmail:", error);
    return { success: false, error: message };
  }
}
