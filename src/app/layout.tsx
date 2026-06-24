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
import { getTenant } from "@/lib/tenants";
import type { TenantTheme } from "@/lib/tenants";
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

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getTenant();
  return { title: metadata.title, description: metadata.description };
}

function themeVars(theme: TenantTheme): React.CSSProperties {
  return {
    "--emerald": theme.emerald,
    "--emerald-deep": theme.emeraldDeep,
    "--gold": theme.gold,
    "--gold-soft": theme.goldSoft,
    "--paper": theme.paper,
    "--paper-cream": theme.paperCream,
    "--paper-deep": theme.paperDeep,
    "--line-soft": theme.lineSoft,
    "--ink-fade": theme.inkFade,
  } as React.CSSProperties;
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const tenant = await getTenant();
  return (
    <html
      lang="fr"
      style={themeVars(tenant.theme)}
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
