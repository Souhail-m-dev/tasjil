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
      className="inline-flex h-10 items-center gap-2 self-start rounded-lg border border-[#cdc5b3] bg-[#f2eadf] px-3 text-[13px] font-medium text-[#3c4130] transition hover:border-[#546b43] hover:text-[#202819] disabled:opacity-60 sm:h-11 sm:self-auto sm:px-4 sm:text-sm"
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
