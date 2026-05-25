"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
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
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (item: NavItem) =>
    item.matchPrefix ? pathname.startsWith(item.href) : pathname === item.href;

  useEffect(() => {
    setCollapsed(localStorage.getItem("admin-sidebar-collapsed") === "1");
  }, []);

  const toggleCollapsed = () =>
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem("admin-sidebar-collapsed", next ? "1" : "0");
      return next;
    });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const renderNav = ({
    onNavigate,
    collapsed = false,
  }: { onNavigate?: () => void; collapsed?: boolean } = {}) => (
    <>
      <div
        className={cn(
          "flex items-center border-b border-[#d6cfc0] py-4",
          collapsed ? "justify-center px-2" : "justify-between px-5",
        )}
      >
        {!collapsed && (
          <Link
            href="/admin"
            onClick={onNavigate}
            className="flex min-w-0 items-center gap-3"
          >
            <Image src="/logo.png" alt="" width={36} height={36} className="shrink-0 rounded-md" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#546b43]">
                Espace
              </p>
              <p className="font-display text-lg leading-tight text-[#202819]">
                Administration
              </p>
            </div>
          </Link>
        )}
        {onNavigate ? (
          <button
            type="button"
            onClick={onNavigate}
            aria-label="Fermer le menu"
            className="inline-flex size-11 items-center justify-center rounded-md text-[#3c4130] transition hover:bg-[#efe4cc] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#546b43]/40"
          >
            <X className="size-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Déployer le menu" : "Réduire le menu"}
            aria-expanded={!collapsed}
            className="inline-flex size-11 items-center justify-center rounded-md text-[#3c4130] transition hover:bg-[#efe4cc] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#546b43]/40"
          >
            {collapsed ? <PanelLeft className="size-5" /> : <PanelLeftClose className="size-5" />}
          </button>
        )}
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
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "group flex min-h-11 items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#546b43]/40",
                    collapsed ? "justify-center px-0" : "px-3",
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
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {!collapsed && (
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
      )}
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#d6cfc0] bg-[#f2eadf] px-3 py-2.5 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          className="inline-flex size-11 items-center justify-center rounded-lg text-[#3c4130] transition hover:bg-[#efe4cc] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#546b43]/40"
        >
          <Menu className="size-5" />
        </button>
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/logo.png" alt="" width={28} height={28} className="rounded" />
          <span className="font-display text-base text-[#202819]">Admin</span>
        </Link>
        <div className="size-11" />
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/45 animate-[var(--animate-fade-in)]"
          />
          <aside
            style={{ backgroundColor: "#f7eedd" }}
            className="absolute inset-y-0 left-0 z-10 flex w-[18rem] max-w-[85%] flex-col border-r border-[#d6cfc0] shadow-[0_20px_50px_rgba(32,40,25,0.25)]"
          >
            {renderNav({ onNavigate: () => setOpen(false) })}
          </aside>
        </div>
      )}

      {/* Desktop rail */}
      <aside
        style={{ backgroundColor: "#f7eedd" }}
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-[#d6cfc0] transition-[width] duration-200 lg:flex",
          collapsed ? "w-[4.75rem]" : "w-72",
        )}
      >
        {renderNav({ collapsed })}
      </aside>
    </>
  );
}
