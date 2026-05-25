import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  CreditCard,
  ArrowLeft,
  ArrowRight,
  Wallet,
  Banknote,
  Mail,
  Send,
  Calendar,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { FlyerViewer } from "@/components/flyer-viewer";
import { Ornament } from "@/components/ui/ornament";
import {
  BOTH_SEMINARS_OPTION_ID,
  BOTH_SEMINARS_PRICE_EUR,
  paymentMethodLabels,
  type PaymentMethod,
} from "@/lib/schemas/registration";
import { formatDate, formatPrice } from "@/lib/format";
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
    note: "Envoyez en envoi d'argent entre proches, SANS commentaire (risque de blocage).",
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
  searchParams: Promise<{
    seminar?: string;
    payment?: PaymentMethod;
    name?: string;
  }>;
}) {
  const {
    seminar: seminarSlug,
    payment,
    name: firstName,
  } = await searchParams;
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

  const startDate = isBundle
    ? seminars?.[0]?.start_date
    : selectedSeminar?.start_date;

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
    <main className="relative min-h-screen w-full bg-[var(--paper)] text-[var(--ink-900)]">
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-4 sm:mb-6">
          <Link
            href="/"
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[var(--line-soft)] bg-[var(--paper-cream)] px-4 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--emerald-deep)] hover:border-[var(--emerald)] sm:h-11 sm:px-5"
          >
            <ArrowLeft className="size-4" />
            Accueil
          </Link>
        </div>

        {/* SUCCESS HEAD */}
        <section className="rounded-3xl border border-[var(--line-soft)] bg-[var(--paper-cream)] p-6 shadow-[0_18px_40px_rgba(13,31,20,0.07)] sm:p-10 md:p-14">
          <div className="flex flex-col items-center text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-[var(--emerald)] text-[var(--gold-soft)] shadow-[0_14px_28px_rgba(13,31,20,0.25)] sm:size-20">
              <CheckCircle2 className="size-8 sm:size-10" strokeWidth={2.2} />
            </div>
            <div className="mt-5 text-[10px] uppercase tracking-[0.28em] text-[var(--emerald)] sm:text-[11px]">
              Inscription enregistrée
            </div>
            <h1 className="mt-3 font-display text-[1.9rem] leading-tight text-[var(--emerald-deep)] sm:text-[2.6rem]">
              {firstName ? <>Bârak Allâhu fîk, {firstName}.</> : <>Votre inscription est enregistrée</>}
            </h1>
            <Ornament className="my-5" />
            <p className="max-w-2xl font-serif text-[14px] leading-[1.7] text-[var(--ink-soft,#434843)] sm:text-[16px]">
              Un email récapitulatif vous a été envoyé avec les instructions de paiement détaillées.
            </p>
            <p className="mt-4 max-w-2xl font-serif text-[13px] leading-[1.7] text-[var(--ink-soft,#434843)] sm:text-[14px]">
              Pensez à regarder vos spams. En cas de problème, contactez-nous à{" "}
              <a
                href="mailto:dr.abdelrahman.abou.abdelwahab@gmail.com"
                className="font-semibold text-[var(--emerald)] underline underline-offset-2 hover:text-[var(--emerald-deep)]"
              >
                dr.abdelrahman.abou.abdelwahab@gmail.com
              </a>
              .
            </p>
          </div>

          {/* WHAT NEXT — 3 steps */}
          <div className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4">
            <NextItem
              num="1"
              icon={<Mail />}
              title="Vérifiez votre email"
              detail={
                chosenPayment
                  ? `Instructions de paiement · ${paymentMethodLabels[chosenPayment]}`
                  : "Instructions de paiement par email."
              }
            />
            <NextItem
              num="2"
              icon={<Send />}
              title="Accès au canal Telegram"
              detail="Vous y serez ajouté après confirmation du paiement."
            />
            <NextItem
              num="3"
              icon={<Calendar />}
              title="Préparez votre étude"
              detail={
                startDate
                  ? `Début : ${formatDate(startDate)}`
                  : "Dates communiquées par email."
              }
            />
          </div>
        </section>

        {/* SUMMARY */}
        <section className="mt-6 sm:mt-8">
          <div className="mx-auto max-w-2xl rounded-2xl border border-[var(--line-soft)] bg-[var(--paper-cream)] p-5 sm:p-6">
            <div className="text-[10px] uppercase tracking-[0.28em] text-[var(--emerald)] sm:text-[11px]">
              Récapitulatif
            </div>
            {flyerSources.length > 0 && (
              <div className="mt-4 flex justify-center gap-3">
                {flyerSources.map((src) => (
                  <FlyerViewer
                    key={src}
                    src={src}
                    alt="Flyer du séminaire"
                    className="overflow-hidden rounded-md ring-1 ring-[var(--line-soft)] transition hover:ring-[var(--emerald)]"
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
            <div className="mt-4 space-y-2.5">
              <SummaryRow label="Séminaire" value={seminarTitle} />
              <SummaryRow label="Tarif" value={seminarPrice} highlight />
              <SummaryRow
                label="Mode de paiement"
                value={chosenPayment ? paymentMethodLabels[chosenPayment] : "À confirmer"}
              />
            </div>
          </div>
        </section>

        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--emerald)] px-7 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--gold-soft)] hover:bg-[var(--emerald-deep)] sm:text-[13px]"
          >
            Retour à l&apos;accueil
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10 flex flex-col items-center gap-1 text-[11px] text-[var(--ink-fade)]">
          <Image src={teacher.logoSrc} alt="" width={28} height={28} className="size-7 opacity-60" />
          <div>{teacher.name}</div>
        </div>
      </div>
    </main>
  );
}

function NextItem({
  num,
  icon,
  title,
  detail,
}: {
  num: string;
  icon: React.ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[var(--line-soft)] bg-[var(--paper)] p-4 text-left sm:p-5">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--emerald)] text-[var(--gold-soft)] sm:size-10">
        <span className="font-serif text-[14px] font-semibold sm:text-[15px]">{num}</span>
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 font-serif text-[14.5px] text-[var(--emerald-deep)] sm:text-[15.5px]">
          <span className="text-[var(--emerald)]">{icon}</span>
          {title}
        </div>
        <div className="mt-1 text-[12.5px] leading-[1.55] text-[var(--ink-soft,#434843)] sm:text-[13.5px]">
          {detail}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  if (highlight) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-[var(--emerald)] bg-[var(--emerald)] px-4 py-3.5 shadow-[0_10px_22px_rgba(13,31,20,0.18)]">
        <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--gold-soft)]">
          {label}
        </div>
        <div className="font-display text-[20px] leading-none text-[var(--gold-soft)] sm:text-[24px]">
          {value}
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-[var(--line-soft)] bg-[var(--paper)] px-4 py-3">
      <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--ink-fade)]">
        {label}
      </div>
      <div className="mt-0.5 font-serif text-[15px] text-[var(--emerald-deep)] sm:text-[16px]">
        {value}
      </div>
    </div>
  );
}
