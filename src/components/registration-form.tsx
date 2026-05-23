"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { formatDate, formatPrice } from "@/lib/format";
import { sendConfirmationEmail } from "@/app/actions/send-confirmation-email";
import { Ornament } from "@/components/ui/ornament";
import { getSeminarDisplay, teacher } from "@/lib/seminar-display";
import {
  BOTH_SEMINARS_OPTION_ID,
  BOTH_SEMINARS_PRICE_EUR,
  registrationSchema,
  walkthroughSteps,
  paymentMethodLabels,
  paymentMethods,
  genders,
  normalizeRegistration,
  type RegistrationInput,
  type PaymentMethod,
  type WalkthroughStep,
} from "@/lib/schemas/registration";
import type { Database } from "@/lib/types/db";

type Seminar = Database["public"]["Tables"]["seminars"]["Row"];

const totalSteps = walkthroughSteps.length;

const paymentDescriptions: Record<PaymentMethod, string> = {
  paypal: "Adresse PayPal envoyée par email après inscription.",
  revolut: "Lien de paiement Revolut par email.",
  espece: "En main propre — contact WhatsApp pour convenir.",
};

const paymentLetter: Record<PaymentMethod, string> = {
  paypal: "A",
  revolut: "B",
  espece: "C",
};

function isBothSeminarsSelection(seminarId: string) {
  return seminarId === BOTH_SEMINARS_OPTION_ID;
}

export function RegistrationForm({
  seminars,
  initialSeminarId,
}: {
  seminars: Seminar[];
  initialSeminarId?: string;
}) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(initialSeminarId ? 1 : 0);
  const [direction, setDirection] = useState<"fwd" | "back">("fwd");
  const [isPending, startTransition] = useTransition();
  const submittingRef = useRef(false);

  const form = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    mode: "onTouched",
    defaultValues: {
      seminar_id: initialSeminarId ?? "",
      first_name: "",
      last_name: "",
      email: "",
      telegram_handle: "",
      zoom_email: "",
      gender: undefined as unknown as RegistrationInput["gender"],
      payment_method: undefined as unknown as RegistrationInput["payment_method"],
      agreed_attendance: false as unknown as true,
      agreed_payment: false as unknown as true,
      agreed_truth: false as unknown as true,
      signature_text: "",
    },
  });

  const { control, handleSubmit, watch, trigger, setValue, formState } = form;
  const values = watch();
  const step = walkthroughSteps[stepIndex];

  const selectedSeminar = useMemo(
    () => seminars.find((s) => s.id === values.seminar_id),
    [seminars, values.seminar_id],
  );
  const isBundle = isBothSeminarsSelection(values.seminar_id);

  const goNext = useCallback(async () => {
    if (step.kind === "review") return;
    if (step.kind === "hadith") {
      // info only
    } else if (step.kind === "oath") {
      const ok = await trigger(
        ["agreed_attendance", "agreed_payment", "agreed_truth"],
        { shouldFocus: true },
      );
      if (!ok) return;
    } else if (step.optional) {
      const currentValue = values[step.key as keyof RegistrationInput];
      if (currentValue && currentValue !== "") {
        const ok = await trigger([step.key as keyof RegistrationInput], { shouldFocus: true });
        if (!ok) return;
      }
    } else {
      const ok = await trigger([step.key as keyof RegistrationInput], { shouldFocus: true });
      if (!ok) return;
    }
    if (stepIndex < totalSteps - 1) {
      setDirection("fwd");
      setStepIndex((i) => i + 1);
    }
  }, [step, stepIndex, trigger, values]);

  const goBack = useCallback(() => {
    if (stepIndex > 0) {
      setDirection("back");
      setStepIndex((i) => i - 1);
    }
  }, [stepIndex]);

  const skipOptional = useCallback(() => {
    if (!step.optional) return;
    setValue(step.key as "telegram_handle" | "zoom_email", "");
    if (stepIndex < totalSteps - 1) {
      setDirection("fwd");
      setStepIndex((i) => i + 1);
    }
  }, [step, stepIndex, setValue]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === "Enter" && step.kind !== "review") {
        const target = e.target as HTMLElement;
        const tag = (target.tagName || "").toLowerCase();
        if (tag === "textarea") return;
        e.preventDefault();
        goNext();
      }
    },
    [step, goNext],
  );

  const onSubmit: SubmitHandler<RegistrationInput> = (data) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    startTransition(async () => {
      const supabase = createClient();
      const payload = normalizeRegistration(data);
      const inserts = isBothSeminarsSelection(data.seminar_id)
        ? seminars.map((seminar) => ({
            ...payload,
            seminar_id: seminar.id,
            payment_status: "pending",
            notes: "Inscription pack 2 séminaires - tarif 250€.",
          }))
        : [{ ...payload, payment_status: "pending" }];
      const { data: insertedData, error } = await supabase
        .from("registrations")
        .insert(inserts)
        .select("id");
      if (error) {
        submittingRef.current = false;
        toast.error("Inscription échouée. Réessayez ou contactez-nous.");
        console.error(error);
        return;
      }
      if (insertedData) {
        void sendConfirmationEmail({
          registrationIds: insertedData.map((r) => r.id),
        });
      }
      const params = new URLSearchParams({
        seminar: isBothSeminarsSelection(data.seminar_id)
          ? BOTH_SEMINARS_OPTION_ID
          : selectedSeminar?.slug ?? "",
        payment: data.payment_method,
        name: data.first_name,
      });
      router.push(`/inscription/merci?${params.toString()}`);
    });
  };

  const progress = ((stepIndex + 1) / totalSteps) * 100;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-50 grid grid-rows-[auto_1fr] bg-[var(--paper)] font-sans text-[var(--ink-900)]"
    >
      {/* TOP BAR */}
      <header className="relative z-10 grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-[var(--line-soft)] bg-[var(--paper)]/90 px-4 py-3 backdrop-blur sm:px-6">
        <div className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-fade)]">
          <Image
            src={teacher.logoSrc}
            alt=""
            width={26}
            height={26}
            className="size-6 rounded-full border border-[var(--line-soft)] bg-[var(--paper-cream)] p-0.5 sm:size-7"
          />
          <span className="hidden sm:inline">Tasjîl · Inscription</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-1 w-[clamp(120px,32vw,320px)] overflow-hidden rounded-full bg-[var(--line-soft)]">
            <div
              className="h-full rounded-full transition-[width] duration-500 ease-out"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, var(--emerald), var(--gold))",
              }}
            />
          </div>
          <div className="whitespace-nowrap text-[11px] font-semibold tracking-[0.1em] text-[var(--ink-fade)]">
            {stepIndex + 1} / {totalSteps}
          </div>
        </div>
        <Link
          href="/"
          aria-label="Fermer"
          className="justify-self-end flex size-9 items-center justify-center rounded-full border border-[var(--line-soft)] text-[var(--ink-soft,#434843)] transition hover:border-[var(--gold)] hover:text-[var(--emerald-deep)]"
        >
          <X className="size-4" />
        </Link>
      </header>

      {/* STAGE */}
      <div className="relative overflow-y-auto px-5 pb-20 pt-8 sm:px-8 sm:pt-14">
        <div
          key={stepIndex}
          className={cn(
            "mx-auto w-full max-w-[600px]",
            direction === "fwd" ? "animate-walk-fwd" : "animate-walk-back",
          )}
        >
          {/* Q number */}
          {step.kind !== "hadith" && (
            <div className="mb-5 inline-flex items-center gap-1.5 text-[12.5px] font-bold tracking-[0.04em] text-[var(--gold)]">
              <span>{stepIndex + 1}</span>
              <ArrowRight className="size-3.5" strokeWidth={2.5} />
            </div>
          )}

          <StepContent
            step={step}
            stepIndex={stepIndex}
            control={control}
            seminars={seminars}
            values={values}
            selectedSeminar={selectedSeminar}
            isBundle={isBundle}
            onAdvance={goNext}
          />

          {/* CTA row */}
          <div className="mt-9 flex flex-wrap items-center gap-4">
            {stepIndex > 0 && (
              <button
                type="button"
                onClick={goBack}
                aria-label="Précédent"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line-soft)] bg-transparent px-3 py-2.5 text-[12px] font-semibold tracking-[0.04em] text-[var(--ink-soft,#434843)] transition hover:border-[var(--gold)] hover:text-[var(--emerald-deep)]"
              >
                <ArrowLeft className="size-3.5" />
                Précédent
              </button>
            )}
            {step.kind === "review" ? (
              <button
                type="submit"
                disabled={isPending || !formState.isValid}
                className="inline-flex items-center gap-2.5 rounded-lg bg-[var(--emerald)] px-5 py-3.5 text-[13px] font-bold uppercase tracking-[0.08em] text-[var(--gold-soft)] shadow-[0_12px_24px_rgba(13,31,20,0.18)] transition hover:bg-[var(--emerald-deep)] hover:text-[var(--gold)] disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Envoi…
                  </>
                ) : (
                  <>
                    Confirmer mon inscription
                    <CheckCircle2 className="size-4" />
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={goNext}
                className="group inline-flex items-center gap-2.5 rounded-lg bg-[var(--emerald)] px-5 py-3.5 text-[13px] font-bold uppercase tracking-[0.08em] text-[var(--gold-soft)] transition hover:-translate-y-px hover:bg-[var(--emerald-deep)] hover:text-[var(--gold)] hover:shadow-[0_14px_28px_rgba(13,31,20,0.22)]"
              >
                Continuer
                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </button>
            )}
            <span className="text-[12px] tracking-[0.04em] text-[var(--ink-fade)]">
              appuyez sur{" "}
              <kbd className="ml-1 inline-block rounded border border-b-2 border-[var(--line-soft)] bg-[var(--paper-cream)] px-1.5 py-0.5 text-[11px] font-semibold text-[var(--ink-soft,#434843)]">
                Entrée ↵
              </kbd>
            </span>
            {step.optional && (
              <button
                type="button"
                onClick={skipOptional}
                className="ml-auto text-[12px] uppercase tracking-[0.14em] text-[var(--ink-fade)] underline-offset-4 hover:text-[var(--emerald-deep)] hover:underline"
              >
                Passer
              </button>
            )}
          </div>
        </div>
      </div>

    </form>
  );
}

// ============================================================================
// Step content router
// ============================================================================
function StepContent({
  step,
  stepIndex,
  control,
  seminars,
  values,
  selectedSeminar,
  isBundle,
  onAdvance,
}: {
  step: WalkthroughStep;
  stepIndex: number;
  control: ReturnType<typeof useForm<RegistrationInput>>["control"];
  seminars: Seminar[];
  values: RegistrationInput;
  selectedSeminar?: Seminar;
  isBundle: boolean;
  onAdvance: () => void;
}) {
  if (step.kind === "seminar-picker") {
    return <SeminarsStep control={control} seminars={seminars} />;
  }
  if (step.kind === "text") {
    return <TextStep step={step} control={control} values={values} />;
  }
  if (step.kind === "email") {
    return <EmailStep step={step} control={control} values={values} />;
  }
  if (step.kind === "choice-gender") {
    return <GenderStep control={control} onAdvance={onAdvance} />;
  }
  if (step.kind === "choice-payment") {
    return <PaymentStep step={step} control={control} onAdvance={onAdvance} />;
  }
  if (step.kind === "hadith") {
    return <HadithStep />;
  }
  if (step.kind === "oath") {
    return <OathStep step={step} control={control} />;
  }
  if (step.kind === "signature") {
    return <SignatureStep control={control} values={values} />;
  }
  if (step.kind === "review" && (selectedSeminar || isBundle)) {
    return (
      <ReviewStep
        seminar={selectedSeminar}
        seminars={seminars}
        values={values}
        isBundle={isBundle}
      />
    );
  }
  return null;
}

// ============================================================================
// Heading
// ============================================================================
function QHead({
  eyebrow,
  title,
  sub,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
}) {
  return (
    <div>
      {eyebrow && (
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">
          {eyebrow}
        </div>
      )}
      <h1
        className="m-0 mb-3.5 font-serif font-semibold leading-[1.15] tracking-[-0.015em] text-[var(--emerald-deep)]"
        style={{ fontSize: "clamp(28px, 5vw, 44px)" }}
      >
        {title}
      </h1>
      {sub && (
        <p
          className="m-0 max-w-[540px] text-[var(--ink-soft,#434843)]"
          style={{ fontSize: "clamp(15px, 1.6vw, 17px)", lineHeight: 1.55 }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// Field error display
// ============================================================================
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="mt-3 rounded border-l-[3px] border-[#ba1a1a] bg-[rgba(186,26,26,0.06)] px-3.5 py-2.5 text-[13px] text-[#93000a]">
      {message}
    </div>
  );
}

// ============================================================================
// Walk-style borderless input
// ============================================================================
const walkInputClass =
  "block w-full border-0 border-b-2 border-[var(--ink-fade)] bg-transparent px-0 py-3.5 font-serif text-[var(--emerald-deep)] outline-none transition-colors focus:border-[var(--emerald)] placeholder:italic placeholder:text-[var(--ink-fade)]/70";

// ============================================================================
// Steps
// ============================================================================
function SeminarsStep({
  control,
  seminars,
}: {
  control: ReturnType<typeof useForm<RegistrationInput>>["control"];
  seminars: Seminar[];
}) {
  return (
    <Controller
      name="seminar_id"
      control={control}
      render={({ field, fieldState }) => (
        <>
          <QHead
            eyebrow="Les séminaires"
            title="Quel séminaire souhaitez-vous suivre ?"
            sub="Vous pouvez choisir un séminaire — ou les deux pour le pack complet."
          />
          <div className="mt-7 grid gap-2.5">
            <ChoiceCard
              letter="•"
              selected={field.value === BOTH_SEMINARS_OPTION_ID}
              onSelect={() => field.onChange(BOTH_SEMINARS_OPTION_ID)}
              title={`Les 2 séminaires — ${formatPrice(BOTH_SEMINARS_PRICE_EUR)}`}
              meta={
                seminars.length >= 2
                  ? `${seminars[0]?.title} + ${seminars[1]?.title}`
                  : "Pack complet"
              }
              variant="card"
            />
            {seminars.map((s, idx) => {
              const display = getSeminarDisplay(s.slug, s.title, s.author);
              return (
                <ChoiceCard
                  key={s.id}
                  letter={String.fromCharCode(65 + idx)}
                  selected={field.value === s.id}
                  onSelect={() => field.onChange(s.id)}
                  title={display.display_title}
                  meta={[
                    s.author,
                    s.start_date && s.end_date
                      ? `${formatDate(s.start_date)} → ${formatDate(s.end_date)}`
                      : null,
                    s.price_eur != null ? formatPrice(s.price_eur) : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                  variant="card"
                />
              );
            })}
          </div>
          <FieldError message={fieldState.error?.message} />
        </>
      )}
    />
  );
}

function TextStep({
  step,
  control,
  values,
}: {
  step: Extract<WalkthroughStep, { kind: "text" }>;
  control: ReturnType<typeof useForm<RegistrationInput>>["control"];
  values: RegistrationInput;
}) {
  const isTelegram = step.key === "telegram_handle";
  const eyebrow =
    step.key === "last_name" && values.first_name
      ? `Bienvenue, ${values.first_name}`
      : step.key === "telegram_handle"
        ? "Telegram"
        : "Identité";
  const sub = "hint" in step ? step.hint : undefined;
  return (
    <Controller
      name={step.key}
      control={control}
      render={({ field, fieldState }) => (
        <>
          <QHead eyebrow={eyebrow} title={step.title} sub={sub} />
          <div className="mt-7">
            {isTelegram ? (
              <div className="flex items-end gap-1 border-b-2 border-[var(--ink-fade)] transition-colors focus-within:border-[var(--emerald)]">
                <span
                  className="pb-3.5 pt-3.5 font-serif text-[var(--ink-fade)]"
                  style={{ fontSize: "clamp(22px, 3vw, 32px)" }}
                >
                  @
                </span>
                <input
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(e.target.value.replace(/^@/, ""))
                  }
                  type="text"
                  autoComplete={"autoComplete" in step ? (step.autoComplete as string | undefined) : undefined}
                  autoFocus
                  placeholder={step.placeholder?.replace(/^@/, "") ?? ""}
                  className={cn(walkInputClass, "border-b-0")}
                  style={{ fontSize: "clamp(22px, 3vw, 32px)" }}
                />
              </div>
            ) : (
              <input
                {...field}
                value={field.value ?? ""}
                type="text"
                autoComplete={step.autoComplete}
                autoFocus
                placeholder={step.placeholder}
                className={walkInputClass}
                style={{ fontSize: "clamp(22px, 3vw, 32px)" }}
              />
            )}
          </div>
          <FieldError message={fieldState.error?.message} />
        </>
      )}
    />
  );
}

function EmailStep({
  step,
  control,
  values,
}: {
  step: Extract<WalkthroughStep, { kind: "email" }>;
  control: ReturnType<typeof useForm<RegistrationInput>>["control"];
  values: RegistrationInput;
}) {
  const eyebrow = step.key === "zoom_email" ? "Compte Zoom" : "Email";
  const sub =
    step.key === "zoom_email"
      ? `Optionnel — uniquement si différent de ${values.email || "votre email principal"}.`
      : ("hint" in step ? step.hint : undefined);
  return (
    <Controller
      name={step.key}
      control={control}
      render={({ field, fieldState }) => (
        <>
          <QHead eyebrow={eyebrow} title={step.title} sub={sub} />
          <div className="mt-7">
            <input
              {...field}
              value={field.value ?? ""}
              type="email"
              inputMode="email"
              autoFocus
              placeholder={step.placeholder}
              className={walkInputClass}
              style={{ fontSize: "clamp(22px, 3vw, 32px)" }}
            />
          </div>
          <FieldError message={fieldState.error?.message} />
        </>
      )}
    />
  );
}

function GenderStep({
  control,
  onAdvance,
}: {
  control: ReturnType<typeof useForm<RegistrationInput>>["control"];
  onAdvance: () => void;
}) {
  const opts: { v: (typeof genders)[number]; label: string; key: string }[] = [
    { v: "homme", label: "Homme", key: "H" },
    { v: "femme", label: "Femme", key: "F" },
  ];
  return (
    <Controller
      name="gender"
      control={control}
      render={({ field, fieldState }) => (
        <>
          <QHead
            title="Vous êtes…"
            sub="Cette information sert à organiser les groupes."
          />
          <div className="mt-7 grid gap-2.5">
            {opts.map((o) => (
              <ChoiceCard
                key={o.v}
                letter={o.key}
                selected={field.value === o.v}
                onSelect={() => {
                  field.onChange(o.v);
                  setTimeout(onAdvance, 180);
                }}
                title={o.label}
              />
            ))}
          </div>
          <FieldError message={fieldState.error?.message} />
        </>
      )}
    />
  );
}

function PaymentStep({
  step,
  control,
  onAdvance,
}: {
  step: Extract<WalkthroughStep, { kind: "choice-payment" }>;
  control: ReturnType<typeof useForm<RegistrationInput>>["control"];
  onAdvance: () => void;
}) {
  return (
    <Controller
      name="payment_method"
      control={control}
      render={({ field, fieldState }) => (
        <>
          <QHead
            eyebrow="Paiement"
            title="Comment souhaitez-vous régler ?"
            sub={step.hint}
          />
          <div className="mt-7 grid gap-2.5">
            {paymentMethods.map((m) => (
              <ChoiceCard
                key={m}
                letter={paymentLetter[m]}
                selected={field.value === m}
                onSelect={() => {
                  field.onChange(m);
                  setTimeout(onAdvance, 220);
                }}
                title={paymentMethodLabels[m]}
                meta={paymentDescriptions[m]}
              />
            ))}
          </div>
          <FieldError message={fieldState.error?.message} />
        </>
      )}
    />
  );
}

function HadithStep() {
  return (
    <div className="px-1 py-2 text-center">
      <div className="mb-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">
        Avant l&apos;engagement — méditons
      </div>
      <div
        className="my-2 text-[var(--emerald-deep)]"
        style={{
          fontFamily: "var(--font-arabic), serif",
          direction: "rtl",
          fontSize: "clamp(26px, 4vw, 36px)",
          lineHeight: 1.7,
        }}
      >
        إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى
      </div>
      <Ornament className="my-5" />
      <p
        className="mx-auto mb-3 max-w-[520px] font-serif italic leading-[1.5] text-[var(--ink-900)]"
        style={{ fontSize: "clamp(18px, 2.2vw, 22px)" }}
      >
        « Les actes ne valent que par les intentions, et à chacun ce qu&apos;il a eu pour intention. »
      </p>
      <div className="text-[12px] uppercase tracking-[0.12em] text-[var(--ink-fade)]">
        Hadîth — rapporté par Boukhârî & Muslim
      </div>
      <p className="mx-auto mt-8 max-w-[480px] text-[14px] leading-[1.6] text-[var(--ink-soft,#434843)]">
        S&apos;inscrire à un séminaire est une amâna. Sur la page suivante, vous attesterez
        quatre engagements simples — puis signerez de votre nom.
      </p>
    </div>
  );
}

function OathStep({
  step,
  control,
}: {
  step: Extract<WalkthroughStep, { kind: "oath" }>;
  control: ReturnType<typeof useForm<RegistrationInput>>["control"];
}) {
  const items: { name: keyof RegistrationInput; label: string }[] = [
    { name: "agreed_attendance", label: "Je m'engage à suivre les cours avec sérieux, assiduité et bonne intention." },
    { name: "agreed_payment", label: "Je m'engage à régler les frais selon le mode de paiement choisi." },
    { name: "agreed_truth", label: "J'atteste de l'exactitude des informations fournies." },
  ];
  return (
    <>
      <QHead eyebrow="Serment" title={step.title} sub={step.hint} />
      <div className="mt-7 grid gap-2.5">
        {items.map((it) => (
          <Controller
            key={it.name}
            name={it.name}
            control={control}
            render={({ field }) => {
              const checked = field.value === true;
              return (
                <label
                  className={cn(
                    "flex cursor-pointer items-start gap-3.5 rounded-xl border-[1.5px] bg-[var(--paper-cream)] px-4 py-4 transition",
                    checked
                      ? "border-[var(--emerald)] bg-[color-mix(in_srgb,var(--paper-cream)_70%,var(--emerald)_30%)]"
                      : "border-[var(--line-soft)] hover:border-[var(--gold)]",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "mt-0.5 flex size-[22px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px] transition",
                      checked
                        ? "border-[var(--emerald)] bg-[var(--emerald)] text-[var(--gold-soft)]"
                        : "border-[var(--ink-fade)] bg-transparent",
                    )}
                  >
                    {checked && (
                      <CheckCircle2 className="size-3.5" strokeWidth={3} />
                    )}
                  </span>
                  <span className="font-serif text-[15px] font-medium leading-[1.45] text-[var(--ink-900)] sm:text-[16px]">
                    {it.label}
                  </span>
                </label>
              );
            }}
          />
        ))}
      </div>
    </>
  );
}

function SignatureStep({
  control,
  values,
}: {
  control: ReturnType<typeof useForm<RegistrationInput>>["control"];
  values: RegistrationInput;
}) {
  const expected = `${values.first_name} ${values.last_name}`.trim();
  return (
    <Controller
      name="signature_text"
      control={control}
      render={({ field, fieldState }) => (
        <>
          <QHead
            eyebrow="Signature"
            title="Signez en saisissant votre nom complet"
            sub={`Pour valider votre serment, écrivez exactement : ${expected}`}
          />
          <div className="relative mt-7 rounded-xl border border-[var(--gold)]/40 bg-[var(--paper-cream)] px-6 pb-5 pt-6">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-1.5 rounded-[10px] border border-dashed border-[var(--gold)]/40"
            />
            <input
              {...field}
              value={field.value ?? ""}
              type="text"
              autoComplete="off"
              autoFocus
              placeholder={expected}
              className={cn(
                walkInputClass,
                "border-b-[var(--gold)] py-2 italic",
              )}
              style={{ fontSize: "clamp(28px, 4vw, 40px)" }}
            />
            <div className="relative mt-2.5 text-[12px] uppercase tracking-[0.1em] text-[var(--ink-fade)]">
              Fait le{" "}
              {new Date().toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
          <FieldError message={fieldState.error?.message} />
        </>
      )}
    />
  );
}

function ReviewStep({
  seminar,
  seminars,
  values,
  isBundle,
}: {
  seminar?: Seminar;
  seminars: Seminar[];
  values: RegistrationInput;
  isBundle: boolean;
}) {
  const seminarLabel = isBundle
    ? "Pack 2 séminaires"
    : seminar?.title ?? "—";
  const dates = isBundle
    ? seminars
        .map(
          (item) =>
            `${item.title} : ${formatDate(item.start_date)} → ${formatDate(item.end_date)}`,
        )
        .join("\n")
    : `${formatDate(seminar?.start_date)} → ${formatDate(seminar?.end_date)}`;
  const price = isBundle
    ? formatPrice(BOTH_SEMINARS_PRICE_EUR)
    : seminar?.price_eur != null
      ? formatPrice(seminar.price_eur)
      : "À confirmer";
  return (
    <>
      <QHead
        eyebrow="Récapitulatif"
        title="Tout est-il correct ?"
        sub="Une dernière vérification avant de confirmer."
      />
      <div className="mt-7 overflow-hidden rounded-xl border border-[var(--line-soft)] bg-[var(--paper-cream)]">
        <ReviewRow label="Séminaire(s)" value={seminarLabel} first />
        <ReviewRow label="Dates" value={dates} />
        <ReviewRow label="Prix" value={price} />
        <ReviewRow
          label="Nom"
          value={`${values.first_name} ${values.last_name}`}
        />
        <ReviewRow
          label="Sexe"
          value={values.gender === "homme" ? "Homme" : "Femme"}
        />
        <ReviewRow label="Email" value={values.email} />
        {values.telegram_handle && (
          <ReviewRow label="Telegram" value={`@${values.telegram_handle}`} />
        )}
        {values.zoom_email && (
          <ReviewRow label="Email Zoom" value={values.zoom_email} />
        )}
        <ReviewRow
          label="Paiement"
          value={paymentMethodLabels[values.payment_method]}
        />
        <ReviewRow
          label="Engagement"
          value={
            <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--emerald)]">
              <CheckCircle2 className="size-4" strokeWidth={2.5} />
              Serment signé · {values.signature_text}
            </span>
          }
        />
      </div>
    </>
  );
}

function ReviewRow({
  label,
  value,
  first,
}: {
  label: string;
  value: React.ReactNode;
  first?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(120px,38%)_1fr] gap-4 px-4 py-3.5 text-[14px] text-[var(--ink-900)] sm:px-5",
        !first && "border-t border-dashed border-[var(--line-soft)]",
      )}
    >
      <span className="self-center text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-fade)]">
        {label}
      </span>
      <span className="break-words text-right font-medium whitespace-pre-line">
        {value}
      </span>
    </div>
  );
}

// ============================================================================
// Choice card (letter key + body)
// ============================================================================
function ChoiceCard({
  letter,
  selected,
  onSelect,
  title,
  meta,
  variant,
}: {
  letter: string;
  selected: boolean;
  onSelect: () => void;
  title: React.ReactNode;
  meta?: React.ReactNode;
  variant?: "card";
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group relative flex w-full items-center gap-3.5 rounded-xl border-[1.5px] bg-[var(--paper-cream)] text-left transition focus:outline-none",
        variant === "card" ? "items-start px-5 py-4" : "px-4 py-3.5",
        selected
          ? "border-[var(--emerald)] bg-[color-mix(in_srgb,var(--paper-cream)_70%,var(--emerald)_30%)] shadow-[0_0_0_3px_rgba(30,48,36,0.06)]"
          : "border-[var(--line-soft)] hover:border-[var(--gold)] hover:bg-[color-mix(in_srgb,var(--paper-cream)_96%,var(--gold)_4%)]",
      )}
    >
      <span
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-md border-[1.5px] font-sans text-[12px] font-bold tracking-[0.04em] transition",
          selected
            ? "border-[var(--emerald)] bg-[var(--emerald)] text-[var(--gold-soft)]"
            : "border-[var(--ink-fade)] bg-[var(--paper)] text-[var(--ink-soft,#434843)]",
        )}
      >
        {letter}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="font-serif text-[16px] font-semibold leading-[1.25] text-[var(--emerald-deep)]">
          {title}
        </span>
        {meta && (
          <span className="text-[12.5px] leading-[1.4] text-[var(--ink-fade)]">
            {meta}
          </span>
        )}
      </span>
    </button>
  );
}
