"use server";

import { render } from "@react-email/render";
import { resend } from "@/lib/email/resend";
import { ReceivedEmail } from "@/lib/email/templates/ReceivedEmail";
import { supabaseAdmin } from "@/lib/supabase/admin";

interface SendConfirmationEmailParams {
  registrationIds: string[];
  force?: boolean;
}

export async function sendConfirmationEmail({
  registrationIds,
  force = false,
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
    if (!resend) {
      console.error("[Email] resend client not initialized");
      return { success: false, error: "Email configuration error" };
    }

    const fromEmail = process.env.EMAIL_FROM;
    const fromName = process.env.EMAIL_FROM_NAME || "Tasjîl";
    const replyTo = process.env.EMAIL_REPLY_TO;
    if (!fromEmail) {
      console.error("[Email] EMAIL_FROM env missing");
      return { success: false, error: "Email sender not configured" };
    }

    console.log(`[Email] Sending for ${registrationIds.length} registrations`);

    const { data: registrations, error: fetchError } = await supabaseAdmin
      .from("registrations")
      .select(`
        *,
        seminars (
          title
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

      const seminarTitles = userRegs
        .map(reg => reg.seminars?.title)
        .filter(Boolean) as string[];

      console.log(`[Email] Rendering template for ${email} with ${seminarTitles.length} seminars`);
      const emailHtml = await render(
        ReceivedEmail({
          firstName: firstReg.first_name,
          lastName: firstReg.last_name,
          seminarTitles: seminarTitles.length > 0 ? seminarTitles : ["Séminaire"],
          paymentMethod: firstReg.payment_method || "Non spécifié",
        })
      );

      try {
        const { data, error: sendError } = await resend.emails.send({
          from: `${fromName} <${fromEmail}>`,
          to: email,
          subject: seminarTitles.length > 1
            ? "Confirmation de vos inscriptions"
            : "Confirmation de votre inscription",
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
