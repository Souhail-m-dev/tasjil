import type { TenantConfig } from "./types";

// NOTE: logo placeholder (/institut/logo.png) — swap when asset lands.
// Palette finalized (teal/sage/gold) per brand spec.
export const institut: TenantConfig = {
  slug: "institut",
  hosts: ["tasjil.drmiloud.com"],
  brand: {
    name: "Institut Cheikh Dr Miloud",
    shortName: "Institut Miloud",
    logoSrc: "/institut/logo.png",
  },
  prof: {
    name: "Dr. Miloud Lamri",
    role: "Diplômé de l'Université Islamique de Médine",
    credentials: [
      "Diplômé de l'Université Islamique de Médine",
    ],
    bioParas: [],
    telegram: "https://t.me/rappelsMiloud",
    youtube: null,
    tazkiyaUrl: "https://youtu.be/OHx5UcYWW0Y",
  },
  terminology: {
    unit: "niveau",
    cycle: "année",
  },
  mail: {
    signature: "Dr. Miloud Lamri",
    paypalEmail: null,
    revolutHandle: null,
    whatsapp: null,
  },
  schedule: "Niveau 1 : jeudi 19h00 · Niveau 2 : vendredi 19h00",
  theme: {
    emerald: "#2F5D62",
    emeraldDeep: "#244A4E",
    gold: "#C8A75A",
    goldSoft: "#DDC084",
    paper: "#FAFAF8",
    paperCream: "#FFFFFF",
    paperDeep: "#F1F1ED",
    lineSoft: "rgba(138, 148, 150, 0.30)",
    inkFade: "#8A9496",
  },
  features: {
    bundle: false,
    zoom: false,
    presentiel: true,
    certificate: true,
    payment: false,
    extendedProfile: true,
  },
  metadata: {
    title: "Institut Cheikh Dr Miloud — Inscription année 2026-2027",
    description:
      "Inscriptions ouvertes pour l'année 2026-2027 : cursus structuré en sciences islamiques (Tawhîd, Sîra, Fiqh, Hadîth), niveaux 1 et 2, distanciel et présentiel.",
  },
};
