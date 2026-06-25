import { z } from "zod";

export const BOTH_SEMINARS_OPTION_ID = "both-seminars";
export const BOTH_SEMINARS_PRICE_EUR = 250;

export const paymentMethods = ["paypal", "revolut", "espece"] as const;
export type PaymentMethod = (typeof paymentMethods)[number];

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  paypal: "PayPal",
  revolut: "Revolut",
  espece: "Espèces / main propre",
};

export const genders = ["homme", "femme"] as const;
export type Gender = (typeof genders)[number];

export const weekdays = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"] as const;
export type Weekday = (typeof weekdays)[number];
export const weekdayLabels: Record<Weekday, string> = {
  lundi: "Lundi",
  mardi: "Mardi",
  mercredi: "Mercredi",
  jeudi: "Jeudi",
  vendredi: "Vendredi",
};

export const previousGroups = [
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi-presentiel",
  "vendredi-distanciel",
] as const;
export type PreviousGroup = (typeof previousGroups)[number];
export const previousGroupLabels: Record<PreviousGroup, string> = {
  mardi: "Mardi",
  mercredi: "Mercredi",
  jeudi: "Jeudi",
  "vendredi-presentiel": "Vendredi (présentiel)",
  "vendredi-distanciel": "Vendredi (distanciel)",
};

const telegramRegex = /^@?[a-zA-Z0-9_]{3,32}$/;

const baseObject = z.object({
  seminar_id: z.string().trim().min(1, "Veuillez sélectionner une option."),
  first_name: z.string().trim().min(1, "Prénom requis.").max(80),
  last_name: z.string().trim().min(1, "Nom requis.").max(80),
  email: z.string().trim().email("Email invalide."),
  telegram_handle: z
    .string()
    .trim()
    .max(60)
    .refine(
      (v) => v === "" || telegramRegex.test(v),
      "Identifiant Telegram invalide (3 à 32 caractères, lettres / chiffres / _).",
    ),
  zoom_email: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      "Email Zoom invalide.",
    ),
  // Extended profile (institut) — all optional.
  birth_date: z.string().trim().max(40),
  phone: z.string().trim().max(40),
  address: z.string().trim().max(160),
  postal_code: z.string().trim().max(20),
  city: z.string().trim().max(80),
  country: z.string().trim().max(80),
  available_days: z.array(z.enum(weekdays)),
  previous_group: z.string().trim().max(40),
  gender: z.enum(genders, { message: "Veuillez choisir." }),
  payment_method: z.enum(paymentMethods).optional(),
  agreed_attendance: z.literal(true, { message: "Vous devez cocher cet engagement." }),
  agreed_payment: z.literal(true, { message: "Vous devez cocher cet engagement." }),
  agreed_truth: z.literal(true, { message: "Vous devez cocher cet engagement." }),
  signature_text: z.string().trim().min(1, "Signez en saisissant votre nom complet."),
});

const signatureRefine = (
  data: z.infer<typeof baseObject>,
  ctx: z.RefinementCtx,
) => {
  const expected = `${data.first_name} ${data.last_name}`.trim().toLowerCase();
  if (data.signature_text.trim().toLowerCase() !== expected) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["signature_text"],
      message: `La signature doit correspondre exactement à « ${data.first_name} ${data.last_name} ».`,
    });
  }
};

export type RegistrationInput = z.infer<typeof baseObject>;

export function makeRegistrationSchema(opts: { payment: boolean }) {
  const obj = opts.payment
    ? baseObject.extend({
        payment_method: z.enum(paymentMethods, {
          message: "Veuillez choisir un mode de paiement.",
        }),
      })
    : baseObject;
  return obj.superRefine(signatureRefine);
}

export const registrationSchema = makeRegistrationSchema({ payment: true });

export function normalizeRegistration(input: RegistrationInput) {
  const clean = (v: string) => (v.trim() === "" ? null : v.trim());
  return {
    seminar_id: input.seminar_id,
    first_name: input.first_name,
    last_name: input.last_name,
    email: input.email.toLowerCase(),
    telegram_handle: input.telegram_handle
      ? input.telegram_handle.startsWith("@")
        ? input.telegram_handle
        : `@${input.telegram_handle}`
      : null,
    zoom_email: input.zoom_email ? input.zoom_email.toLowerCase() : null,
    birth_date: clean(input.birth_date),
    phone: clean(input.phone),
    address: clean(input.address),
    postal_code: clean(input.postal_code),
    city: clean(input.city),
    country: clean(input.country),
    available_days:
      input.available_days && input.available_days.length > 0
        ? input.available_days
        : null,
    previous_group: clean(input.previous_group),
    gender: input.gender,
    payment_method: input.payment_method ?? null,
    agreed_attendance: input.agreed_attendance,
    agreed_payment: input.agreed_payment,
    agreed_truth: input.agreed_truth,
    signature_text: input.signature_text.trim(),
    signed_at: new Date().toISOString(),
  };
}

export type WalkthroughStep =
  | {
      key: "seminar_id";
      kind: "seminar-picker";
      optional: false;
      title: string;
      hint?: string;
    }
  | {
      key:
        | "first_name"
        | "last_name"
        | "telegram_handle"
        | "phone"
        | "address"
        | "postal_code"
        | "city"
        | "country";
      kind: "text";
      optional: boolean;
      title: string;
      placeholder?: string;
      autoComplete?: string;
      hint?: string;
    }
  | {
      key: "birth_date";
      kind: "date";
      optional: boolean;
      title: string;
      hint?: string;
    }
  | {
      key: "email" | "zoom_email";
      kind: "email";
      optional: boolean;
      title: string;
      placeholder?: string;
      hint?: string;
    }
  | {
      key: "available_days";
      kind: "choice-days";
      optional: false;
      title: string;
      hint?: string;
    }
  | {
      key: "previous_group";
      kind: "choice-prev-group";
      optional: false;
      title: string;
      hint?: string;
    }
  | {
      key: "gender";
      kind: "choice-gender";
      optional: false;
      title: string;
    }
  | {
      key: "payment_method";
      kind: "choice-payment";
      optional: false;
      title: string;
      hint?: string;
    }
  | {
      key: "hadith";
      kind: "hadith";
      optional: false;
      title: string;
    }
  | {
      key: "oath";
      kind: "oath";
      optional: false;
      title: string;
      hint?: string;
    }
  | {
      key: "signature_text";
      kind: "signature";
      optional: false;
      title: string;
    }
  | {
      key: "review";
      kind: "review";
      optional: false;
      title: string;
    };

export function buildSteps(opts: {
  unit: string;
  zoom: boolean;
  payment: boolean;
  extendedProfile: boolean;
  isNiveau2: boolean;
}): WalkthroughStep[] {
  const { unit, zoom, payment, extendedProfile, isNiveau2 } = opts;
  const steps: WalkthroughStep[] = [
    {
      key: "seminar_id",
      kind: "seminar-picker",
      optional: false,
      title: `Quel ${unit} souhaitez-vous suivre ?`,
    },
    {
      key: "first_name",
      kind: "text",
      optional: false,
      title: "Quel est votre prénom ?",
      placeholder: "Ahmed",
      autoComplete: "given-name",
    },
    {
      key: "last_name",
      kind: "text",
      optional: false,
      title: "Et votre nom ?",
      placeholder: "Ibn Mohammed",
      autoComplete: "family-name",
    },
  ];

  if (extendedProfile) {
    steps.push({
      key: "birth_date",
      kind: "date",
      optional: true,
      title: "Votre date de naissance ?",
      hint: "Optionnel.",
    });
  }

  steps.push({
    key: "email",
    kind: "email",
    optional: false,
    title: "Votre adresse email ?",
    placeholder: "vous@email.com",
    hint: "Utilisée pour vous envoyer la confirmation et les modalités.",
  });

  if (extendedProfile) {
    steps.push({
      key: "phone",
      kind: "text",
      optional: true,
      title: "Votre numéro de téléphone ?",
      placeholder: "+33 6 12 34 56 78",
      autoComplete: "tel",
      hint: "Optionnel.",
    });
  }

  steps.push({
    key: "telegram_handle",
    kind: "text",
    optional: true,
    title: "Votre identifiant Telegram ?",
    placeholder: "@votrepseudo",
    hint: "Optionnel — pour rejoindre le groupe de travail.",
  });

  if (zoom) {
    steps.push({
      key: "zoom_email",
      kind: "email",
      optional: true,
      title: "Email utilisé sur Zoom ?",
      placeholder: "zoom@email.com",
      hint: "Optionnel — uniquement si différent de votre email principal.",
    });
  }

  if (extendedProfile) {
    steps.push(
      {
        key: "address",
        kind: "text",
        optional: true,
        title: "Votre adresse postale ?",
        placeholder: "12 rue de la Paix",
        autoComplete: "street-address",
        hint: "Optionnel.",
      },
      {
        key: "postal_code",
        kind: "text",
        optional: true,
        title: "Code postal ?",
        placeholder: "69000",
        autoComplete: "postal-code",
        hint: "Optionnel.",
      },
      {
        key: "city",
        kind: "text",
        optional: true,
        title: "Ville ?",
        placeholder: "Lyon",
        autoComplete: "address-level2",
        hint: "Optionnel.",
      },
      {
        key: "country",
        kind: "text",
        optional: true,
        title: "Pays ?",
        placeholder: "France",
        autoComplete: "country-name",
        hint: "Optionnel.",
      },
      {
        key: "available_days",
        kind: "choice-days",
        optional: false,
        title: "Vos disponibilités (fin de journée) ?",
        hint: "Cochez vos jours — vous serez ensuite associé à un groupe.",
      },
    );
    if (isNiveau2) {
      steps.push({
        key: "previous_group",
        kind: "choice-prev-group",
        optional: false,
        title: "Groupe précédent — quand suiviez-vous le Niveau 1 ?",
      });
    }
  }

  steps.push({
    key: "gender",
    kind: "choice-gender",
    optional: false,
    title: "Vous êtes...",
  });

  if (payment) {
    steps.push({
      key: "payment_method",
      kind: "choice-payment",
      optional: false,
      title: "Comment souhaitez-vous régler ?",
      hint: "Le paiement n'est pas effectué en ligne. Les modalités vous seront envoyées.",
    });
  }

  steps.push(
    {
      key: "hadith",
      kind: "hadith",
      optional: false,
      title: "Avant l'engagement — méditons",
    },
    {
      key: "oath",
      kind: "oath",
      optional: false,
      title: "Vos engagements",
      hint: "Cochez chacun pour attester.",
    },
    {
      key: "signature_text",
      kind: "signature",
      optional: false,
      title: "Signez en saisissant votre nom complet",
    },
    {
      key: "review",
      kind: "review",
      optional: false,
      title: "Tout est correct ?",
    },
  );

  return steps;
}
