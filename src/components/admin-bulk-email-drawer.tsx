"use client";

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { Loader2, Mail, Send, X, ChevronDown, ChevronUp } from "lucide-react";
import { sendConfirmationEmail } from "@/app/actions/send-confirmation-email";

export function AdminBulkEmailDrawer({
  registrationIds,
  count,
  isSelectionActive,
}: {
  registrationIds: string[];
  count: number;
  isSelectionActive: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSending, startSending] = useTransition();
  const [courseLink, setCourseLink] = useState("");
  const [telegramLink, setTelegramLink] = useState("");
  const [subject, setSubject] = useState("");
  const [customContent, setCustomContent] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleSend = () => {
    if (!courseLink.trim()) {
      toast.error("Le lien du cours est requis.");
      return;
    }

    startSending(async () => {
      const res = await sendConfirmationEmail({
        registrationIds,
        template: "course_link",
        courseLink: courseLink.trim(),
        telegramLink: telegramLink.trim() || undefined,
        subject: subject.trim() || undefined,
        customContent: customContent.trim() || undefined,
        force: true,
      });

      if (res.success) {
        toast.success(`Email envoyé à ${res.results?.length ?? 0} personnes.`);
        setOpen(false);
        setCourseLink("");
        setTelegramLink("");
        setSubject("");
        setCustomContent("");
      } else {
        toast.error(res.error || "Échec de l'envoi.");
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={count === 0}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#cdc5b3] bg-[#fbefdf] px-4 text-sm font-medium text-[#3c4130] transition hover:border-[#546b43] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#546b43]/40 disabled:opacity-50 sm:w-auto"
      >
        <Mail className="size-4" />
        Email cours
      </button>

      {mounted && open
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-[9999] flex items-end justify-center bg-[#0e0a06]/55 backdrop-blur-sm sm:items-center sm:p-6"
              onClick={() => setOpen(false)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-[#fbefdf] shadow-[0_-20px_50px_rgba(0,0,0,0.35)] sm:max-h-full sm:rounded-2xl sm:shadow-[0_30px_60px_rgba(0,0,0,0.35)]"
              >
                <header className="flex items-start justify-between gap-3 border-b border-[#d6cfc0] bg-[#f2eadf] px-4 py-3.5 sm:px-5 sm:py-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#546b43]">
                      Envoi groupé
                    </p>
                    <h2 className="mt-0.5 font-display text-lg text-[#202819] sm:text-xl">
                      Lien du premier cours
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex size-11 items-center justify-center rounded-lg border border-[#cdc5b3] bg-[#fbefdf] text-[#3c4130] transition hover:border-[#546b43]"
                  >
                    <X className="size-5" />
                  </button>
                </header>

                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-5">
                  <div className="mb-6 rounded-xl bg-[#546b43]/5 p-4 border border-[#546b43]/10">
                    <p className="text-sm text-[#3c4130]">
                      L&apos;email sera envoyé aux <strong>{count} personnes</strong> {isSelectionActive ? "sélectionnées" : "filtrées"}.
                    </p>
                    <p className="mt-1 text-xs text-[#5e6353]">
                      Chaque destinataire recevra un email personnalisé listant ses séminaires.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <label htmlFor="courseLink" className="text-[13px] font-medium text-[#202819]">
                        Lien du cours (Zoom/Meet/etc.)
                      </label>
                      <input
                        id="courseLink"
                        type="url"
                        value={courseLink}
                        onChange={(e) => setCourseLink(e.target.value)}
                        placeholder="https://zoom.us/j/..."
                        className="h-11 w-full rounded-lg border border-[#cdc5b3] bg-[#fbefdf] px-3 text-base text-[#202819] placeholder:text-[#98927f] focus:border-[#546b43] focus:outline-none focus:ring-2 focus:ring-[#546b43]/25 sm:text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="telegramLink" className="text-[13px] font-medium text-[#202819]">
                        Lien Telegram (optionnel)
                      </label>
                      <input
                        id="telegramLink"
                        type="url"
                        value={telegramLink}
                        onChange={(e) => setTelegramLink(e.target.value)}
                        placeholder="https://t.me/joinchat/..."
                        className="h-11 w-full rounded-lg border border-[#cdc5b3] bg-[#fbefdf] px-3 text-base text-[#202819] placeholder:text-[#98927f] focus:border-[#546b43] focus:outline-none focus:ring-2 focus:ring-[#546b43]/25 sm:text-sm"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="flex items-center gap-1.5 text-xs font-medium text-[#546b43] hover:underline"
                    >
                      {showAdvanced ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                      Options avancées (Sujet, Message personnalisé)
                    </button>

                    {showAdvanced && (
                      <div className="space-y-5 rounded-xl border border-[#cdc5b3] bg-[#f2eadf]/50 p-4">
                        <div className="space-y-1.5">
                          <label htmlFor="subject" className="text-[13px] font-medium text-[#202819]">
                            Sujet personnalisé
                          </label>
                          <input
                            id="subject"
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Par défaut: Lien du premier cours — ..."
                            className="h-11 w-full rounded-lg border border-[#cdc5b3] bg-[#fbefdf] px-3 text-base text-[#202819] placeholder:text-[#98927f] focus:border-[#546b43] focus:outline-none focus:ring-2 focus:ring-[#546b43]/25 sm:text-sm"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="customContent" className="text-[13px] font-medium text-[#202819]">
                            Message personnalisé (corps du mail)
                          </label>
                          <textarea
                            id="customContent"
                            rows={4}
                            value={customContent}
                            onChange={(e) => setCustomContent(e.target.value)}
                            placeholder="Texte additionnel inséré au début de l'email..."
                            className="w-full rounded-lg border border-[#cdc5b3] bg-[#fbefdf] p-3 text-base text-[#202819] placeholder:text-[#98927f] focus:border-[#546b43] focus:outline-none focus:ring-2 focus:ring-[#546b43]/25 sm:text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <footer className="flex flex-col-reverse gap-2.5 border-t border-[#d6cfc0] bg-[#f2eadf] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-end sm:px-5 sm:py-4">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    disabled={isSending}
                    className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-[#cdc5b3] bg-[#fbefdf] px-4 text-sm font-medium text-[#3c4130] transition hover:border-[#546b43] sm:w-auto"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={isSending || !courseLink.trim()}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#202819] px-5 text-sm font-medium text-[#fbefdf] shadow-[0_10px_22px_rgba(32,40,25,0.18)] transition hover:bg-[#3c4130] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#546b43]/40 disabled:opacity-60 sm:w-auto"
                  >
                    {isSending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Send className="size-4" />
                    )}
                    Envoyer les emails
                  </button>
                </footer>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
