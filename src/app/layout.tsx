import type { Metadata } from "next";
import {
  Inter,
  Libre_Baskerville,
  Cormorant_Garamond,
  Bodoni_Moda,
  Allura,
  Amiri,
} from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Display headlines (Al Nevrada-like). Bodoni Moda is the closest open font.
const bodoni = Bodoni_Moda({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

// Body serif (Baskerville).
const baskerville = Libre_Baskerville({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Athelas-like — kept for legacy uses.
const cormorant = Cormorant_Garamond({
  variable: "--font-athelas",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const allura = Allura({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
});

const amiri = Amiri({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Séminaires en ligne — Inscription",
  description:
    "Inscrivez-vous aux séminaires : Explication de Hisn al-Muslim et Résumé des beaux noms d'Allah.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${bodoni.variable} ${baskerville.variable} ${cormorant.variable} ${allura.variable} ${amiri.variable} h-full antialiased`}
    >
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Toaster position="top-center" richColors theme="light" />
      </body>
    </html>
  );
}
