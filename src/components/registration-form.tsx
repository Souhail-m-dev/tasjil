"use client";

import { useMemo, useState, useTransition, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  CheckCircle2,
  Loader2,
  CreditCard,
  Wallet,
  SkipForward,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { formatDate, formatPrice } from "@/lib/format";
import { Field, inputClass } from "@/components/ui/field";
import { RadioCard } from "@/components/ui/radio-card";
import { FlyerViewer } from "@/components/flyer-viewer";
import { getSeminarDisplay } from "@/lib/seminar-display";
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

const paymentIcons: Record<PaymentMethod, React.ReactNode> = {
  paypal: <CreditCard className="size-5" />,
  revolut: <Wallet className="size-5" />,
  espece: <Banknote className="size-5" />,
};

const paymentHints: Record<PaymentMethod, string> = {
  paypal: "Coordonnées PayPal envoyées par email.",
  revolut: "Lien Revolut envoyé après confirmation.",
  espece: "À régler en main propre avant le début.",
};

const totalSteps = walkthroughSteps.length;

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
  const [isPending, startTransition] = useTransition();

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
    if (step.optional) {
      // For optional fields validate only if non-empty
      const currentValue = values[step.key as keyof RegistrationInput];
      if (currentValue && currentValue !== "") {
        const ok = await trigger([step.key], { shouldFocus: true });
        if (!ok) return;
      }
    } else {
      const ok = await trigger([step.key as keyof RegistrationInput], { shouldFocus: true });
      if (!ok) return;
    }
    if (stepIndex < totalSteps - 1) {
      setStepIndex((i) => i + 1);
    }
  }, [step, stepIndex, trigger, values]);

  const goBack = useCallback(() => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }, [stepIndex]);

  const skipOptional = useCallback(() => {
    if (!step.optional) return;
    setValue(step.key as "telegram_handle" | "zoom_email", "");
    if (stepIndex < totalSteps - 1) setStepIndex((i) => i + 1);
  }, [step, stepIndex, setValue]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === "Enter" && step.kind !== "review") {
        const target = e.target as HTMLElement;
        if (target.tagName === "TEXTAREA") return;
        e.preventDefault();
        goNext();
      }
    },
    [step, goNext],
  );

  const onSubmit: SubmitHandler<RegistrationInput> = (data) => {
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
        : [
            {
              ...payload,
              payment_status: "pending",
            },
          ];
      const { error } = await supabase.from("registrations").insert(inserts);
      if (error) {
        toast.error("Inscription échouée. Réessayez ou contactez-nous.");
        console.error(error);
        return;
      }
      router.push(
        `/inscription/merci?seminar=${
          isBothSeminarsSelection(data.seminar_id)
            ? BOTH_SEMINARS_OPTION_ID
            : selectedSeminar?.slug ?? ""
        }&payment=${data.payment_method}`,
      );
    });
  };

  const progress = ((stepIndex + 1) / totalSteps) * 100;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={onKeyDown}
      className="relative flex min-h-screen w-full flex-col"
    >
      {/* Top progress bar */}
      <div className="fixed inset-x-0 top-0 z-30 h-1 bg-[#e4d4b7]">
        <div
          className="h-full bg-[#546b43] transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-3 pb-8 pt-16 sm:px-6 sm:pb-12 sm:pt-20 md:pt-28">
        <div className="rounded-2xl border border-[#d6cfc0] bg-[#fbefdf] p-4 shadow-[0_14px_28px_rgba(32,40,25,0.08)] sm:p-6 md:p-8 lg:p-10">
        <header className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-[#5e6353] sm:text-xs sm:tracking-[0.25em]">
          <span>
            Étape {stepIndex + 1} / {totalSteps}
          </span>
          {step.optional && (
            <button
              type="button"
              onClick={skipOptional}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#cdc5b3] px-3 py-1.5 text-[10px] tracking-[0.16em] text-[#3c4130] hover:border-[#546b43] transition"
            >
              Passer
              <SkipForward className="size-3" />
            </button>
          )}
        </header>

        <div
          key={stepIndex}
          className="flex flex-1 flex-col items-center justify-center gap-6 py-6 animate-[var(--animate-slide-in)] sm:gap-8 sm:py-12"
        >
          <h1 className="max-w-2xl text-center font-display text-[1.6rem] leading-[1.15] text-[#202819] sm:text-3xl md:text-5xl">
            {step.title}
          </h1>

          <div className="w-full max-w-2xl">
            <StepContent
              step={step}
              control={control}
              seminars={seminars}
              values={values}
              selectedSeminar={selectedSeminar}
              isBundle={isBundle}
              onAdvance={goNext}
            />
          </div>
        </div>

        <NavButtons
          isFirst={stepIndex === 0}
          isReview={step.kind === "review"}
          isPending={isPending}
          canSubmit={formState.isValid}
          onBack={goBack}
          onNext={goNext}
        />
        </div>
      </div>
    </form>
  );
}

function StepContent({
  step,
  control,
  seminars,
  values,
  selectedSeminar,
  isBundle,
  onAdvance,
}: {
  step: WalkthroughStep;
  control: ReturnType<typeof useForm<RegistrationInput>>["control"];
  seminars: Seminar[];
  values: RegistrationInput;
  selectedSeminar?: Seminar;
  isBundle: boolean;
  onAdvance: () => void;
}) {
  if (step.kind === "seminar-picker") {
    return (
      <Controller
        name="seminar_id"
        control={control}
        render={({ field, fieldState }) => (
          <Field error={fieldState.error?.message}>
            <div className="grid gap-3 lg:grid-cols-2">
              <RadioCard
                checked={field.value === BOTH_SEMINARS_OPTION_ID}
                onSelect={() => {
                  field.onChange(BOTH_SEMINARS_OPTION_ID);
                }}
                icon={<FlyerDiptych seminars={seminars} />}
                title={
                  <span className="flex flex-wrap items-baseline gap-2">
                    <span>Les 2 séminaires</span>
                    <span className="text-sm font-semibold text-[#546b43]">
                      {formatPrice(BOTH_SEMINARS_PRICE_EUR)}
                    </span>
                  </span>
                }
                subtitle={
                  seminars.length >= 2
                    ? `${seminars[0]?.title} + ${seminars[1]?.title}`
                    : "Accès aux deux séminaires"
                }
              />
              {seminars.map((s) => {
                const display = getSeminarDisplay(s.slug, s.title, s.author);
                return (
                  <RadioCard
                    key={s.id}
                    checked={field.value === s.id}
                    onSelect={() => {
                      field.onChange(s.id);
                    }}
                    icon={
                      display.flyerSrc ? (
                        <FlyerThumb src={display.flyerSrc} alt={s.title} />
                      ) : undefined
                    }
                    title={
                      <span className="flex flex-wrap items-baseline gap-2">
                        <span>{s.title}</span>
                        {s.price_eur != null && (
                          <span className="text-sm font-semibold text-[#546b43]">
                            {formatPrice(s.price_eur)}
                          </span>
                        )}
                      </span>
                    }
                    subtitle={
                      <>
                        {s.author && <span>{s.author} · </span>}
                        <span>
                          Du {formatDate(s.start_date)} au {formatDate(s.end_date)}
                        </span>
                      </>
                    }
                  />
                );
              })}
            </div>
          </Field>
        )}
      />
    );
  }

  if (step.kind === "text" || step.kind === "email") {
    const isEmail = step.kind === "email";
    return (
      <Controller
        name={step.key}
        control={control}
        render={({ field, fieldState }) => (
          <Field
            htmlFor={step.key}
            hint={"hint" in step ? step.hint : undefined}
            error={fieldState.error?.message}
          >
            <input
              {...field}
              id={step.key}
              autoFocus
              type={isEmail ? "email" : "text"}
              inputMode={isEmail ? "email" : "text"}
              autoComplete={"autoComplete" in step ? step.autoComplete : undefined}
              placeholder={step.placeholder}
              className={inputClass}
              aria-invalid={!!fieldState.error}
            />
          </Field>
        )}
      />
    );
  }

  if (step.kind === "choice-gender") {
    return (
      <Controller
        name="gender"
        control={control}
        render={({ field, fieldState }) => (
          <Field error={fieldState.error?.message}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {genders.map((g) => (
                <RadioCard
                  key={g}
                  checked={field.value === g}
                  onSelect={() => {
                    field.onChange(g);
                    setTimeout(onAdvance, 180);
                  }}
                  title={
                    <span className="block text-center text-lg">
                      {g === "homme" ? "Homme" : "Femme"}
                    </span>
                  }
                />
              ))}
            </div>
          </Field>
        )}
      />
    );
  }

  if (step.kind === "choice-payment") {
    return (
      <Controller
        name="payment_method"
        control={control}
        render={({ field, fieldState }) => (
          <Field hint={step.hint} error={fieldState.error?.message}>
            <div className="grid gap-2.5 sm:gap-3 lg:grid-cols-2">
              {paymentMethods.map((m) => (
                <RadioCard
                  key={m}
                  checked={field.value === m}
                  onSelect={() => {
                    field.onChange(m);
                    setTimeout(onAdvance, 180);
                  }}
                  icon={paymentIcons[m]}
                  title={paymentMethodLabels[m]}
                  subtitle={paymentHints[m]}
                />
              ))}
            </div>
          </Field>
        )}
      />
    );
  }

  if (step.kind === "review" && (selectedSeminar || isBundle)) {
    return (
      <ReviewCard
        seminar={selectedSeminar}
        seminars={seminars}
        values={values}
        isBundle={isBundle}
      />
    );
  }

  return null;
}

function ReviewCard({
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
  const flyerSources = isBundle
    ? seminars
        .map((s) => getSeminarDisplay(s.slug, s.title, s.author).flyerSrc)
        .filter((src): src is string => !!src)
    : seminar
      ? [getSeminarDisplay(seminar.slug, seminar.title, seminar.author).flyerSrc].filter(
          (src): src is string => !!src,
        )
      : [];

  return (
    <div className="divide-y divide-[#cdc5b3] rounded-xl border border-[#cdc5b3] bg-[#f2eadf]">
      {flyerSources.length > 0 && (
        <div className="flex items-center justify-center gap-3 bg-[#fbefdf] px-4 py-4">
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
      <ReviewRow
        label="Séminaire"
        value={
          isBundle
            ? "Pack 2 séminaires"
            : seminar?.title ?? ""
        }
      />
      <ReviewRow
        label="Dates"
        value={
          isBundle
            ? seminars
                .map((item) => `${item.title}: du ${formatDate(item.start_date)} au ${formatDate(item.end_date)}`)
                .join(" | ")
            : `Du ${formatDate(seminar?.start_date)} au ${formatDate(seminar?.end_date)}`
        }
      />
      <ReviewRow
        label="Prix"
        value={
          isBundle
            ? formatPrice(BOTH_SEMINARS_PRICE_EUR)
            : seminar?.price_eur != null
              ? formatPrice(seminar.price_eur)
              : "À confirmer"
        }
      />
      <ReviewRow label="Nom" value={`${values.first_name} ${values.last_name}`} />
      <ReviewRow label="Email" value={values.email} />
      {values.telegram_handle && (
        <ReviewRow label="Telegram" value={values.telegram_handle} />
      )}
      {values.zoom_email && (
        <ReviewRow label="Email Zoom" value={values.zoom_email} />
      )}
      <ReviewRow label="Genre" value={values.gender === "homme" ? "Homme" : "Femme"} />
      <ReviewRow label="Paiement" value={paymentMethodLabels[values.payment_method]} />
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-3 sm:gap-3">
      <dt className="text-xs uppercase tracking-wider text-[#5e6353]">{label}</dt>
      <dd className="break-words font-medium text-[#202819] sm:col-span-2">{value}</dd>
    </div>
  );
}

function NavButtons({
  isFirst,
  isReview,
  isPending,
  canSubmit,
  onBack,
  onNext,
}: {
  isFirst: boolean;
  isReview: boolean;
  isPending: boolean;
  canSubmit: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col-reverse gap-2.5 pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-8">
      <button
        type="button"
        onClick={onBack}
        disabled={isFirst || isPending}
        className={cn(
          "inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#cdc5b3] bg-[#f2eadf] px-5 text-sm font-medium text-[#3c4130] transition hover:border-[#546b43] sm:justify-start",
          "disabled:opacity-30 disabled:pointer-events-none",
        )}
      >
        <ArrowLeft className="size-4" />
        Retour
      </button>
      {isReview ? (
        <button
          type="submit"
          disabled={isPending || !canSubmit}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#202819] px-6 text-base font-medium text-[#fbefdf] shadow-[0_12px_24px_rgba(32,40,25,0.18)] hover:bg-[#3c4130] transition disabled:opacity-60 sm:px-8"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Envoi…
            </>
          ) : (
            <>
              Confirmer mon inscription
              <CheckCircle2 className="size-5" />
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#202819] px-6 text-base font-medium text-[#fbefdf] shadow-[0_12px_24px_rgba(32,40,25,0.18)] hover:bg-[#3c4130] transition sm:px-8"
        >
          Continuer
          <ArrowRight className="size-4" />
        </button>
      )}
    </div>
  );
}

function FlyerThumb({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="overflow-hidden rounded-md ring-1 ring-[#cdc5b3]">
      <Image
        src={src}
        alt={alt}
        width={56}
        height={78}
        className="h-auto w-10 object-cover sm:w-12"
      />
    </div>
  );
}

function FlyerDiptych({ seminars }: { seminars: Seminar[] }) {
  const flyers = seminars
    .map((s) => getSeminarDisplay(s.slug, s.title, s.author).flyerSrc)
    .filter((src): src is string => !!src)
    .slice(0, 2);
  if (flyers.length === 0) return null;
  return (
    <div className="flex gap-1">
      {flyers.map((src) => (
        <div
          key={src}
          className="overflow-hidden rounded-md ring-1 ring-[#cdc5b3]"
        >
          <Image
            src={src}
            alt=""
            width={44}
            height={62}
            className="h-auto w-7 object-cover sm:w-9"
          />
        </div>
      ))}
    </div>
  );
}
