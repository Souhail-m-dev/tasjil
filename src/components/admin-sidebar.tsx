"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminSignOut } from "@/components/admin-sign-out";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  matchPrefix?: boolean;
};

const navItems: NavItem[] = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/inscriptions", label: "Inscriptions", icon: Users, matchPrefix: true },
  { href: "/admin/seminaires", label: "Séminaires", icon: CalendarDays, matchPrefix: true },
];

export function AdminSidebar({ email }: { email: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (item: NavItem) =>
    item.matchPrefix ? pathname.startsWith(item.href) : pathname === item.href;

  return (
    <>
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#d6cfc0] bg-[#f2eadf]/95 px-3 py-2.5 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          className="inline-flex size-10 items-center justify-center rounded-lg border border-[#cdc5b3] bg-[#fbefdf] text-[#3c4130] transition hover:border-[#546b43]"
        >
          <Menu className="size-5" />
        </button>
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/logo.png" alt="" width={28} height={28} className="rounded" />
          <span className="font-display text-base text-[#202819]">Admin</span>
        </Link>
        <div className="size-10" />
      </header>

      {/* Backdrop (mobile) */}
      {open && (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#d6cfc0] bg-[#f7eedd] transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between border-b border-[#d6cfc0] px-5 py-5">
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3"
          >
            <Image
              src="/logo.png"
              alt=""
              width={36}
              height={36}
              className="rounded-md"
            />
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#546b43]">
                Espace
              </p>
              <p className="font-display text-lg leading-tight text-[#202819]">
                Administration
              </p>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer"
            className="inline-flex size-9 items-center justify-center rounded-md text-[#3c4130] hover:bg-[#efe4cc] lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                      active
                        ? "bg-[#546b43] text-[#fbefdf] shadow-[0_8px_18px_rgba(84,107,67,0.25)]"
                        : "text-[#3c4130] hover:bg-[#efe4cc] hover:text-[#202819]",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-4 shrink-0 transition",
                        active ? "text-[#fbefdf]" : "text-[#5e6353] group-hover:text-[#202819]",
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-[#d6cfc0] px-4 py-4">
          {email && (
            <div className="mb-3 min-w-0">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#546b43]">
                Connecté
              </p>
              <p className="mt-0.5 truncate font-serif text-[13px] text-[#202819]">
                {email}
              </p>
            </div>
          )}
          <AdminSignOut />
        </div>
      </aside>
    </>
  );
}
