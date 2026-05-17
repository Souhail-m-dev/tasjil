"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FlyerViewer } from "@/components/flyer-viewer";

const FLYER_RATIO = 976 / 1280;

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Renders flyer as a vertical strip on the right side of a card.
 * Reads its own offsetParent height each frame so the strip width
 * always equals offsetParent.height * FLYER_RATIO.
 * Card height stays driven by left-column content; strip just follows.
 */
export function FlyerPanelThumb({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;

    const update = () => {
      const h = parent.clientHeight;
      setWidth(Math.round(h * FLYER_RATIO));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative shrink-0 self-stretch"
      style={{ width: width ?? 120 }}
    >
      <FlyerViewer
        src={src}
        alt={alt}
        className="absolute inset-0 !block overflow-hidden border-l border-[#e3cc9e]/20 transition hover:opacity-95"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      </FlyerViewer>
    </div>
  );
}
