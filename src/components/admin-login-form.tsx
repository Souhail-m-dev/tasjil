"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Field, inputClass, labelClass } from "@/components/ui/field";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error || !data.user) {
        setError(error?.message ?? "Identifiants invalides.");
        toast.error("Connexion refusée.");
        return;
      }

      const { data: admin } = await supabase
        .from("admins")
        .select("id")
        .eq("email", data.user.email ?? "")
        .maybeSingle();

      if (!admin) {
        await supabase.auth.signOut();
        setError("Ce compte n'est pas administrateur.");
        toast.error("Compte non autorisé.");
        return;
      }

      toast.success("Connecté.");
      router.replace("/admin");
      router.refresh();
    });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field htmlFor="admin-email">
        <label htmlFor="admin-email" className={labelClass}>
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@email.com"
          className={inputClass}
        />
      </Field>

      <Field htmlFor="admin-password">
        <label htmlFor="admin-password" className={labelClass}>
          Mot de passe
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className={inputClass}
        />
      </Field>

      {error && (
        <p className="rounded-lg border border-[#e2b1a3] bg-[#fbe6df] px-3 py-2 text-sm text-[#a8321b]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#202819] px-6 text-base font-medium text-[#fbefdf] shadow-[0_12px_24px_rgba(32,40,25,0.18)] transition hover:bg-[#3c4130] disabled:opacity-60"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Connexion…
          </>
        ) : (
          <>
            <LogIn className="size-4" />
            Se connecter
          </>
        )}
      </button>
    </form>
  );
}
