"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function FlyerViewer({
  src,
  alt,
  children,
  className,
  style,
}: {
  src: string;
  alt: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);
  const [fit, setFit] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const overlay = open && (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={() => setOpen(false)}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0e0a06]/92 p-3 backdrop-blur-sm sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-full max-w-full overflow-auto rounded-lg bg-[#16130d] shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className={cn(
            "block",
            fit ? "max-h-[90vh] w-auto cursor-zoom-in" : "max-w-none cursor-zoom-out",
          )}
          onClick={() => setFit((v) => !v)}
        />
      </div>

      <div className="fixed right-3 top-3 z-[10000] flex items-center gap-2 sm:right-4 sm:top-4">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setFit((v) => !v);
          }}
          aria-label={fit ? "Taille réelle" : "Ajuster à l'écran"}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#3c4130] bg-[#1a1611]/95 px-3 text-[12px] font-medium text-[#fbefdf] shadow-[0_8px_18px_rgba(0,0,0,0.4)] backdrop-blur transition hover:border-[#e3cc9e]/50"
        >
          {fit ? (
            <>
              <ZoomIn className="size-4" />
              100%
            </>
          ) : (
            <>
              <ZoomOut className="size-4" />
              Ajuster
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Fermer"
          className="inline-flex size-10 items-center justify-center rounded-lg border border-[#3c4130] bg-[#1a1611]/95 text-[#fbefdf] shadow-[0_8px_18px_rgba(0,0,0,0.4)] backdrop-blur transition hover:border-[#e3cc9e]/50"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Voir le flyer : ${alt}`}
        style={style}
        className={cn(
          "block cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-[#546b43]",
          className,
        )}
      >
        {children}
      </button>

      {mounted && overlay ? createPortal(overlay, document.body) : null}
    </>
  );
}
