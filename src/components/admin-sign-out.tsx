"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AdminSignOut() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.replace("/admin/login");
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#cdc5b3] bg-[#f2eadf] px-4 text-sm font-medium text-[#3c4130] transition hover:border-[#546b43] hover:text-[#202819] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#546b43]/40 disabled:opacity-60"
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <LogOut className="size-4" />
      )}
      Déconnexion
    </button>
  );
}
