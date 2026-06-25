import type { TenantConfig } from "./types";

// NOTE: DA (logo + palette) not finalized. Theme below is a placeholder
// distinct from the seminaire (deep blue / bronze). Swap when assets land.
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
  schedule: "Niveau 1 : jeudi 19h00 · Niveau 2 : vendredi 19h00",
  theme: {
    emerald: "#15293f",
    emeraldDeep: "#0e1c2c",
    gold: "#b8894b",
    goldSoft: "#d9b483",
    paper: "#faf7f1",
    paperCream: "#f6f1e8",
    paperDeep: "#efe8da",
    lineSoft: "rgba(20, 30, 45, 0.12)",
    inkFade: "#6b7280",
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
