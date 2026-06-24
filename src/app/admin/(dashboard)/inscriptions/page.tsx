import { createClient } from "@/lib/supabase/server";
import { getTenant } from "@/lib/tenants";
import { AdminRegistrationsTable } from "@/components/admin-registrations-table";

export const metadata = {
  title: "Inscriptions — Administration",
};

export default async function AdminInscriptionsPage() {
  const supabase = await createClient();
  const { slug: tenant } = await getTenant();

  const [{ data: registrations }, { data: seminars }] = await Promise.all([
    supabase
      .from("registrations")
      .select("*, seminars(*)")
      .order("created_at", { ascending: false }),
    supabase
      .from("seminars")
      .select("*")
      .eq("tenant", tenant)
      .order("start_date", { ascending: true }),
  ]);

  return (
    <div className="flex flex-col gap-5 sm:gap-8">
      <header className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[#546b43] sm:text-[11px] sm:tracking-[0.32em]">
          Gestion
        </p>
        <h1 className="mt-1.5 font-display text-2xl text-[#202819] sm:mt-2 sm:text-4xl">
          Inscriptions
        </h1>
        <p className="mt-1 font-serif italic text-[12px] text-[#5e6353] sm:text-sm">
          Recherchez, filtrez et modifiez chaque inscription.
        </p>
      </header>

      <AdminRegistrationsTable
        registrations={registrations ?? []}
        seminars={seminars ?? []}
        tenant={tenant}
      />
    </div>
  );
}
