import Image from "next/image";
import { teacher } from "@/lib/seminar-display";

export function TeacherHeader() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex justify-center px-4 pt-4 md:pt-6">
      <div className="pointer-events-auto relative overflow-hidden rounded-[1.75rem] border border-[#d8bc8d]/45 bg-[#13100d]/90 px-4 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl md:px-6 md:py-4">
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-1/2"
          style={{ background: "linear-gradient(135deg, rgba(70,44,28,0.75), rgba(45,27,16,0.35))" }}
        />
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 w-1/2"
          style={{ background: "linear-gradient(225deg, rgba(21,54,36,0.8), rgba(7,25,16,0.35))" }}
        />
        <div className="relative flex items-center gap-4 md:gap-5">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-[#d8bc8d]/50 md:size-12">
            <Image
              src={teacher.logoSrc}
              alt={`Logo ${teacher.name}`}
              width={48}
              height={48}
              className="h-auto w-full object-contain p-0.5"
              priority
            />
          </div>
          <div className="flex flex-col leading-tight text-left">
            <span className="text-[9px] uppercase tracking-[0.28em] text-[#d8bc8d]/80 md:text-[10px]">
              {teacher.role}
            </span>
            <span className="font-serif text-sm text-[#f4ead6] md:text-base">
              {teacher.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
