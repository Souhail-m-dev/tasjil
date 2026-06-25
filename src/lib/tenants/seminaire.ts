import type { TenantConfig } from "./types";

export const seminaire: TenantConfig = {
  slug: "seminaire",
  hosts: [],
  brand: {
    name: "Tasjîl — Séminaires du Dr. AbdelRahman",
    shortName: "Tasjîl",
    logoSrc: "/logo.png",
  },
  prof: {
    name: "Dr. AbdelRahman Abu Abdelwahab",
    role: "Docteur en ʿAqîda · Université de Médine",
    credentials: [
      "Doctorat 2019 — Université Islamique de Médine",
      "18 années d'études à Médine",
      "Khatîb à Lyon et Firminy",
      "Séminaires en France & pays francophones",
    ],
    bioParas: [
      "Formé à l'Université Islamique de Médine à partir de 2001 — institut de langue arabe, licence en Hadîth, magistère puis doctorat en ʿAqîda obtenu en 2019. Il transmet la science islamique en français depuis cette même période.",
      "Installé entre Lyon et Firminy, il y officie comme khatîb le vendredi et anime plusieurs cours hebdomadaires en mosquées et centres religieux. Il intervient également dans des séminaires en ligne et en présentiel, en France et dans les pays francophones limitrophes.",
    ],
    telegram: "https://t.me/drabderahman",
    youtube: null,
    tazkiyaUrl: null,
  },
  terminology: {
    unit: "séminaire",
    cycle: "session",
  },
  mail: {
    signature: "Dr. AbdelRahman Abou Abdelwahab",
    paypalEmail: "zerroug.djallel@gmail.com",
    revolutHandle: "mohasou69",
    whatsapp: "+33 7 81 69 14 96",
  },
  schedule: "Lundi, mercredi & vendredi · 19h30 – 20h30",
  theme: {
    emerald: "#1d1e30",
    emeraldDeep: "#171826",
    gold: "#c5a059",
    goldSoft: "#e9c176",
    paper: "#fcf9f3",
    paperCream: "#f9f6f0",
    paperDeep: "#f3efe5",
    lineSoft: "rgba(58, 46, 38, 0.12)",
    inkFade: "#737873",
  },
  features: {
    bundle: true,
    zoom: true,
    presentiel: false,
    certificate: false,
    payment: true,
    extendedProfile: false,
  },
  metadata: {
    title: "Tasjîl — Séminaires du Dr. AbdelRahman",
    description:
      "Inscrivez-vous aux séminaires : Explication de Hisn al-Muslim et Résumé des beaux noms d'Allah.",
  },
};
