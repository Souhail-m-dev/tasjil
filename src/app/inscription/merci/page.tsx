import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, CreditCard, ArrowLeft, Wallet, Banknote } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { FlyerViewer } from "@/components/flyer-viewer";
import {
  BOTH_SEMINARS_OPTION_ID,
  BOTH_SEMINARS_PRICE_EUR,
  paymentMethodLabels,
  type PaymentMethod,
} from "@/lib/schemas/registration";
import { formatPrice } from "@/lib/format";
import { getSeminarDisplay, teacher } from "@/lib/seminar-display";

export const metadata = {
  title: "Confirmation — Séminaires",
};

const paymentDetails: Record<
  PaymentMethod,
  {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: string;
    note?: string;
  }
> = {
  paypal: {
    icon: CreditCard,
    title: "Email PayPal",
    value: "zerroug.djallel@gmail.com",
    note: "Veuillez s'il vous plaît faire le paiement en envoi d'argent entre proches, et SANS mettre de commentaire sur PayPal au risque de bloquer le paiement.",
  },
  revolut: {
    icon: Wallet,
    title: "@ Revolut",
    value: "mohasou69",
  },
  espece: {
    icon: Banknote,
    title: "Numéro WhatsApp",
    value: "+33 0 00 00 00 00",
  },
};

export default async function MerciPage({
  searchParams,
}: {
  searchParams: Promise<{ seminar?: string; payment?: PaymentMethod }>;
}) {
  const { seminar: seminarSlug, payment } = await searchParams;
  const supabase = await createClient();

  const { data: seminars } = await supabase
    .from("seminars")
    .select("*")
    .order("start_date", { ascending: true });

  const isBundle = seminarSlug === BOTH_SEMINARS_OPTION_ID;
  const selectedSeminar = seminarSlug
    ? seminars?.find((s) => s.slug === seminarSlug)
    : undefined;

  const seminarTitle = isBundle
    ? "Pack 2 séminaires"
    : selectedSeminar
      ? getSeminarDisplay(
          selectedSeminar.slug,
          selectedSeminar.title,
          selectedSeminar.author,
        ).display_title
      : "Votre inscription";

  const seminarPrice = isBundle
    ? formatPrice(BOTH_SEMINARS_PRICE_EUR)
    : selectedSeminar?.price_eur != null
      ? formatPrice(selectedSeminar.price_eur)
      : "Tarif communiqué prochainement";

  const chosenPayment = payment && payment in paymentDetails ? payment : undefined;

  const flyerSources: string[] = isBundle
    ? (seminars ?? [])
        .map((s) => getSeminarDisplay(s.slug, s.title, s.author).flyerSrc)
        .filter((src): src is string => !!src)
    : selectedSeminar
      ? [
          getSeminarDisplay(
            selectedSeminar.slug,
            selectedSeminar.title,
            selectedSeminar.author,
          ).flyerSrc,
        ].filter((src): src is string => !!src)
      : [];

  return (
    <main
      className="relative min-h-screen w-full"
      style={{
        background: "linear-gradient(180deg, #f2eadf 0%, #e9e1d2 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'><path d='M120 24l36 20v40l-36 20-36-20V44zM120 104l36 20v40l-36 20-36-20v-40zM48 64l36 20v40l-36 20-36-20V84zM192 64l36 20v40l-36 20-36-20V84z' fill='none' stroke='%23546b43' stroke-width='1.2'/></svg>\")",
          backgroundSize: "200px",
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="mb-3 sm:mb-4">
          <Link
            href="/"
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#d6cfc0] bg-[#fbefdf] px-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#3c4130] shadow-[0_8px_18px_rgba(32,40,25,0.10)] transition hover:border-[#546b43] hover:text-[#202819] sm:h-11 sm:px-4 sm:text-xs sm:tracking-[0.18em]"
          >
            <ArrowLeft className="size-4" />
            Accueil
          </Link>
        </div>

        <section className="rounded-2xl border border-[#d6cfc0] bg-[#fbefdf] p-4 shadow-[0_14px_28px_rgba(32,40,25,0.08)] sm:p-6 md:p-8 lg:p-10">
          <div className="flex flex-col items-center text-center">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
              <Image
                src={teacher.logoSrc}
                alt={`Logo ${teacher.name}`}
                width={88}
                height={88}
                className="h-auto w-14 object-contain sm:w-20"
                priority
              />
              <div className="text-center sm:text-left">
                <p className="font-serif text-base text-[#202819] sm:text-2xl">
                  {teacher.name}
                </p>
                <p className="mt-0.5 text-[12px] text-[#5e6353] sm:text-sm">
                  Confirmation d&apos;inscription
                </p>
              </div>
            </div>

            <div className="mt-6 flex size-14 items-center justify-center rounded-full bg-[#e3cc9e] ring-1 ring-[#546b43]/30 sm:mt-8 sm:size-16">
              <CheckCircle2 className="size-7 text-[#202819] sm:size-8" />
            </div>

            <h1 className="mt-4 font-display text-2xl leading-tight text-[#202819] sm:mt-5 sm:text-4xl">
              Votre inscription est enregistrée
            </h1>
            <p className="mt-2 max-w-2xl font-serif text-[13px] leading-6 text-[#3c4130] sm:mt-3 sm:text-base sm:leading-7">
              Nous attendons la réception du paiement. Vous serez ensuite contacté par mail avec toutes les informations utiles.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-xl border border-[#cdc5b3] bg-[#f2eadf] p-4 sm:p-5">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#546b43] sm:text-[11px] sm:tracking-[0.28em]">
                Récapitulatif
              </p>
              {flyerSources.length > 0 && (
                <div className="mt-3 flex justify-center gap-2 sm:mt-4 sm:gap-3">
                  {flyerSources.map((src) => (
                    <FlyerViewer
                      key={src}
                      src={src}
                      alt="Flyer du séminaire"
                      className="overflow-hidden rounded-md ring-1 ring-[#cdc5b3] transition hover:ring-[#546b43]"
                    >
                      <Image
                        src={src}
                        alt=""
                        width={120}
                        height={170}
                        className="h-auto w-20 object-cover sm:w-[120px]"
                      />
                    </FlyerViewer>
                  ))}
                </div>
              )}
              <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
                <SummaryRow label="Séminaire" value={seminarTitle} />
                <SummaryRow label="Tarif" value={seminarPrice} />
                <SummaryRow
                  label="Mode de paiement"
                  value={chosenPayment ? paymentMethodLabels[chosenPayment] : "À confirmer"}
                />
              </div>
            </div>

            <div className="rounded-xl border border-[#cdc5b3] bg-[#f2eadf] p-4 sm:p-5">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#546b43] sm:text-[11px] sm:tracking-[0.28em]">
                Étapes suivantes
              </p>
              <ol className="mt-3 space-y-2 text-[13px] leading-6 text-[#3c4130] sm:mt-4 sm:space-y-3 sm:text-sm sm:leading-7">
                <li>1. Effectuez votre paiement ci-dessous.</li>
                <li>2. Nous confirmons la réception.</li>
                <li>3. Vous êtes contacté par mail.</li>
                <li>4. Email de confirmation avec les accès.</li>
              </ol>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4 md:grid-cols-3">
            {(
              Object.entries(paymentDetails) as [
                PaymentMethod,
                { icon: React.ComponentType<{ className?: string }>; title: string; value: string },
              ][]
            ).map(([method, detail]) => {
              const Icon = detail.icon;
              const isActive = chosenPayment === method;

              return (
                <div
                  key={method}
                  className="rounded-xl border p-4 sm:p-5"
                  style={{
                    borderColor: isActive ? "#546b43" : "#cdc5b3",
                    background: isActive ? "#fbefdf" : "#f2eadf",
                    boxShadow: isActive ? "0 12px 28px rgba(84,107,67,0.15)" : "none",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#e3cc9e] text-[#3c4130] ring-1 ring-[#cdc5b3]">
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-serif text-sm font-medium text-[#202819]">
                        {paymentMethodLabels[method]}
                      </p>
                      <p className="truncate text-[10px] uppercase tracking-[0.14em] text-[#5e6353] sm:text-xs sm:tracking-[0.16em]">
                        {detail.title}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 break-all font-serif text-sm text-[#202819]">
                    {detail.value}
                  </p>
                  {method === "espece" && (
                    <p className="mt-1.5 text-[11px] leading-5 text-[#5e6353] sm:text-xs sm:leading-6">
                      WhatsApp pour règlement en main propre.
                    </p>
                  )}
                  {detail.note && (
                    <p className="mt-1.5 text-[11px] leading-5 text-[#5e6353] sm:text-xs sm:leading-6">
                      {detail.note}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-[#98927f] bg-[#f0e8dd] px-4 py-3 text-[12px] leading-5 text-[#5e6353] sm:mt-8 sm:px-5 sm:py-4 sm:text-sm sm:leading-7">
            Remplacez ces valeurs par vos vraies coordonnées de paiement : @ Revolut, email PayPal, WhatsApp.
          </div>
        </section>
      </div>
    </main>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#d6cfc0] bg-[#fbefdf] px-3 py-2.5 sm:px-4 sm:py-3">
      <p className="text-[10px] uppercase tracking-[0.16em] text-[#5e6353] sm:text-xs sm:tracking-[0.18em]">
        {label}
      </p>
      <p className="mt-0.5 font-serif text-[15px] text-[#202819] sm:mt-1 sm:text-base">
        {value}
      </p>
    </div>
  );
}
