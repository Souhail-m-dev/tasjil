import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin-sidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminRow } = await supabase
    .from("admins")
    .select("role")
    .eq("email", user.email ?? "")
    .maybeSingle();

  if (!adminRow) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=not-admin");
  }

  return (
    <div
      className="min-h-screen lg:flex"
      style={{ background: "linear-gradient(180deg, #f2eadf 0%, #e9e1d2 100%)" }}
    >
      <AdminSidebar email={user.email ?? null} />
      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-10 lg:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
