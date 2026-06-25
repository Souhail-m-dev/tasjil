import { createClient } from "@/lib/supabase/server";
import { getTenant } from "@/lib/tenants";
import { RegistrationForm } from "@/components/registration-form";

export const metadata = {
  title: "Inscription — Séminaires",
};

export default async function InscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ seminar?: string }>;
}) {
  const { seminar: slug } = await searchParams;
  const tenantConfig = await getTenant();
  const supabase = await createClient();
  const { data: seminars, error } = await supabase
    .from("seminars")
    .select("*")
    .eq("tenant", tenantConfig.slug)
    .order("start_date", { ascending: true });

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--paper)] p-6">
        <p className="text-center text-sm text-[#a8321b]">
          Erreur Supabase : {error.message}
        </p>
      </main>
    );
  }

  const initialSeminarId = slug
    ? seminars?.find((s) => s.slug === slug)?.id
    : undefined;

  return (
    <RegistrationForm
      seminars={seminars ?? []}
      initialSeminarId={initialSeminarId}
      tenant={{
        slug: tenantConfig.slug,
        unit: tenantConfig.terminology.unit,
        schedule: tenantConfig.schedule,
        logoSrc: tenantConfig.brand.logoSrc,
        features: {
          bundle: tenantConfig.features.bundle,
          zoom: tenantConfig.features.zoom,
          payment: tenantConfig.features.payment,
          extendedProfile: tenantConfig.features.extendedProfile,
        },
      }}
    />
  );
}
