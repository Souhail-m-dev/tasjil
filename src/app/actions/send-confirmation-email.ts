"use server";

import { render } from "@react-email/render";
import { transporter, verifyConnection } from "@/lib/email/transport";
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
    console.log("[Env] GMAIL_USER:", process.env.GMAIL_USER ? "Defined" : "MISSING");
    console.log("[Env] GMAIL_APP_PASSWORD:", process.env.GMAIL_APP_PASSWORD ? "Defined" : "MISSING");
    console.log("[Env] SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "Defined" : "MISSING");
    
    if (!supabaseAdmin) {
      console.error("[Email] supabaseAdmin is not initialized. Check your environment variables.");
      return { success: false, error: "Database configuration error" };
    }

    const isSmtpOk = await verifyConnection();
    if (!isSmtpOk) {
      console.error("[Email] SMTP verification failed. Check Gmail credentials.");
      return { success: false, error: "Email server configuration error" };
    }

    console.log(`[Email] Starting send process for ${registrationIds.length} registrations`);
    
    // 1. Fetch registrations with seminar titles
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

    // Group registrations by email to send ONE combined email if multiple IDs provided for same person
    const groupedByEmail: Record<string, typeof registrations> = {};
    for (const reg of registrations) {
      if (!groupedByEmail[reg.email]) groupedByEmail[reg.email] = [];
      groupedByEmail[reg.email].push(reg);
    }

    console.log(`[Email] Grouped into ${Object.keys(groupedByEmail).length} unique emails`);
    const results = [];

    for (const [email, userRegs] of Object.entries(groupedByEmail)) {
      const firstReg = userRegs[0];
      
      // 2. Idempotency check: skip if ALL registrations in this group were sent within 10 mins, unless forced
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

      // 3. Prepare email content
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

      // 4. Send email
      const fromEmail = process.env.GMAIL_USER;
      const fromName = process.env.EMAIL_FROM_NAME || "Inscription Séminaire";
      
      console.log(`[Email] Attempting SMTP send to ${email} via ${fromEmail}`);
      
      try {
        const info = await transporter.sendMail({
          from: `"${fromName}" <${fromEmail}>`,
          to: email,
          subject: seminarTitles.length > 1 
            ? "Confirmation de vos inscriptions" 
            : "Confirmation de votre inscription",
          html: emailHtml,
          headers: {
            "X-App-Source": "SeminarRegistration",
          },
        });

        console.log(`[Email] SMTP success for ${email}. MessageID: ${info.messageId}`);

        // 5. Update ALL registration records in this group
        const { error: updateError } = await supabaseAdmin
          .from("registrations")
          .update({
            confirmation_email_sent_at: new Date().toISOString(),
            confirmation_email_message_id: info.messageId,
          })
          .in("id", userRegs.map(r => r.id));

        if (updateError) {
          console.error(`[Email] DB Update failed for ${email}:`, updateError);
          results.push({ email, status: "partial_success", error: "Email sent but DB update failed" });
        } else {
          results.push({ email, status: "success", messageId: info.messageId });
        }
      } catch (smtpError: any) {
        console.error(`[Email] SMTP failed for ${email}:`, smtpError);
        results.push({ email, status: "failed", error: smtpError.message });
      }
    }

    return { success: true, results };
  } catch (error: any) {
    console.error("Error in sendConfirmationEmail:", error);
    return { success: false, error: error.message };
  }
}
