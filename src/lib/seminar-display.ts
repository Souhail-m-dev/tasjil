export type Palette = {
  bgFrom: string;
  bgTo: string;
  surface: string;
  surfaceSoft: string;
  accent: string;
  accentSoft: string;
  badge: string;
};

// Colors derived from Flyer 1 (Hisn al-Muslim) - Rich deep brown and gold
export const brownPalette: Palette = {
  bgFrom: "#1a0f08", // Very dark chocolate brown
  bgTo: "#3d2616",   // Warmer brown for depth
  surface: "#efe1c4",
  surfaceSoft: "#cdb58a",
  accent: "#d4b483", // Gold
  accentSoft: "#f2e6d0", // Cream
  badge: "rgba(212,180,131,0.15)",
};

// Colors derived from Flyer 2 (Beaux Noms d'Allah) - Deep forest green and gold
export const navyPalette: Palette = {
  bgFrom: "#06140d", // Deepest forest green
  bgTo: "#0f2e1f",   // Dark emerald green
  surface: "#ead8b3",
  surfaceSoft: "#bea06a",
  accent: "#c5a467", // Muted gold
  accentSoft: "#e3d5b0", // Light gold
  badge: "rgba(197,164,103,0.15)",
};

export type SeminarDisplay = {
  overline: string;
  display_title: string;
  subtitle_fr: string;
  display_author: string;
  palette: Palette;
  flyerSrc: string | null;
};

export const seminarSchedule = "Lundi, mercredi & vendredi · 19h30 – 20h30";

export const teacher = {
  name: "Dr. AbdelRahman Abu Abdelwahab",
  nameUpper: "DR. ABDELRAHMAN ABU ABDELWAHAB",
  role: "Cours et explications assurés par",
  logoSrc: "/logo.png",
};

export const seminarDisplay: Record<string, SeminarDisplay> = {
  "hisn-al-muslim": {
    overline: "Explication de",
    display_title: "Hisnu al-Muslim (Citadelle du musulman)",
    subtitle_fr: "Sa'id bin Ali bin Wahf Al-Qahtani",
    display_author: "SA'ID BIN ALI BIN WAHF AL-QAHTANI",
    palette: brownPalette,
    flyerSrc: "/flyers/flyer1.png",
  },
  "beaux-noms-allah": {
    overline: "Explication du livre",
    display_title: "Le résumé de la compréhension des beaux noms d'Allah",
    subtitle_fr: "Shaykh Abd Ar-Razzâq al-Badr",
    display_author: "DR. ABDELRAHMAN ABU ABDELWAHAB",
    palette: navyPalette,
    flyerSrc: "/flyers/flyer2.png",
  },
  "asma-al-husna-resume": {
    overline: "Explication du livre",
    display_title: "Le résumé de la compréhension des beaux noms d'Allah",
    subtitle_fr: "Shaykh Abd Ar-Razzâq al-Badr",
    display_author: "DR. ABDELRAHMAN ABU ABDELWAHAB",
    palette: navyPalette,
    flyerSrc: "/flyers/flyer2.png",
  },
};

export function getSeminarDisplay(slug: string, fallbackTitle: string, fallbackAuthor: string | null): SeminarDisplay {
  return (
    seminarDisplay[slug] ?? {
      overline: "",
      display_title: fallbackTitle,
      subtitle_fr: "",
      display_author: (fallbackAuthor ?? "").toUpperCase(),
      palette: brownPalette,
      flyerSrc: null,
    }
  );
}
