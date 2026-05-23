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

const telegramRegex = /^@?[a-zA-Z0-9_]{3,32}$/;

export const registrationSchema = z
  .object({
    seminar_id: z.string().trim().min(1, "Veuillez sélectionner un séminaire."),
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
    gender: z.enum(genders, { message: "Veuillez choisir." }),
    payment_method: z.enum(paymentMethods, {
      message: "Veuillez choisir un mode de paiement.",
    }),
    agreed_rules: z.literal(true, { message: "Vous devez cocher cet engagement." }),
    agreed_attendance: z.literal(true, { message: "Vous devez cocher cet engagement." }),
    agreed_payment: z.literal(true, { message: "Vous devez cocher cet engagement." }),
    agreed_truth: z.literal(true, { message: "Vous devez cocher cet engagement." }),
    signature_text: z.string().trim().min(1, "Signez en saisissant votre nom complet."),
  })
  .superRefine((data, ctx) => {
    const expected = `${data.first_name} ${data.last_name}`.trim().toLowerCase();
    if (data.signature_text.trim().toLowerCase() !== expected) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["signature_text"],
        message: `La signature doit correspondre exactement à « ${data.first_name} ${data.last_name} ».`,
      });
    }
  });

export type RegistrationInput = z.infer<typeof registrationSchema>;

export function normalizeRegistration(input: RegistrationInput) {
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
    gender: input.gender,
    payment_method: input.payment_method,
    agreed_rules: input.agreed_rules,
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
      key: "first_name" | "last_name";
      kind: "text";
      optional: false;
      title: string;
      placeholder?: string;
      autoComplete?: string;
    }
  | {
      key: "email";
      kind: "email";
      optional: false;
      title: string;
      placeholder?: string;
      hint?: string;
    }
  | {
      key: "telegram_handle";
      kind: "text";
      optional: true;
      title: string;
      placeholder?: string;
      hint?: string;
    }
  | {
      key: "zoom_email";
      kind: "email";
      optional: true;
      title: string;
      placeholder?: string;
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

export const walkthroughSteps: WalkthroughStep[] = [
  {
    key: "seminar_id",
    kind: "seminar-picker",
    optional: false,
    title: "Quel séminaire souhaitez-vous suivre ?",
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
  {
    key: "email",
    kind: "email",
    optional: false,
    title: "Votre adresse email ?",
    placeholder: "vous@email.com",
    hint: "Utilisée pour vous envoyer la confirmation et les modalités.",
  },
  {
    key: "telegram_handle",
    kind: "text",
    optional: true,
    title: "Votre identifiant Telegram ?",
    placeholder: "@votrepseudo",
    hint: "Optionnel — pour rejoindre le canal du séminaire.",
  },
  {
    key: "zoom_email",
    kind: "email",
    optional: true,
    title: "Email utilisé sur Zoom ?",
    placeholder: "zoom@email.com",
    hint: "Optionnel — uniquement si différent de votre email principal.",
  },
  {
    key: "gender",
    kind: "choice-gender",
    optional: false,
    title: "Vous êtes...",
  },
  {
    key: "payment_method",
    kind: "choice-payment",
    optional: false,
    title: "Comment souhaitez-vous régler ?",
    hint: "Le paiement n'est pas effectué en ligne. Les modalités vous seront envoyées.",
  },
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
    title: "Vos quatre engagements",
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
];
