"use client";

import Link from "next/link";
import type { FeaturedShow } from "@/types";

interface Props {
  data: FeaturedShow;
}

export default function FeaturedShowSection({ data }: Props) {
  return (
    <section className="px-4 py-8 lg:px-8 lg:py-10">
      <div className="
        relative overflow-hidden group card-glow rounded-2xl
        h-[480px]
        lg:h-[560px] lg:max-w-[1600px] lg:mx-auto
      ">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage: `linear-gradient(to top, #12100F 0%, rgba(18,16,15,0.5) 50%, rgba(18,16,15,0.1) 100%), url('${data.backgroundImage}')`,
          }}
        />

        {/* ── MOBILE — texte en bas ── */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 gap-4 lg:hidden">
          {data.isLive && (
            <div className="live-dot w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A896] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00A896]" />
              </span>
              En Direct
            </div>
          )}
          <h2 className="text-3xl font-black leading-[1.1] tracking-tight text-[#F0EDE8] max-w-[90%]">
            {data.title}
          </h2>
          <div className="flex flex-wrap gap-3 mt-2">
            <Link href={data.ctaPrimary.href} className="bg-[#E63012] hover:bg-[#B8240C] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all">
              <span className="material-symbols-outlined">play_circle</span>
              {data.ctaPrimary.label}
            </Link>
            <Link href={data.ctaSecondary.href} className="bg-[#0D2347]/40 backdrop-blur-md border border-[#0D2347] text-[#F0EDE8] px-6 py-3 rounded-xl font-bold transition-all hover:bg-[#0D2347]/60">
              {data.ctaSecondary.label}
            </Link>
          </div>
        </div>

        {/* ── DESKTOP — layout deux zones ── */}
        <div className="hidden lg:flex absolute inset-0 items-end">
          {/* Gradient latéral desktop */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#12100F]/90 via-[#12100F]/30 to-transparent pointer-events-none" />

          <div className="relative z-10 w-full max-w-3xl p-10 pb-12 flex flex-col gap-5">
            {data.isLive && (
              <div className="live-dot w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A896] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00A896]" />
                </span>
                En Direct
              </div>
            )}

            <h2 className="text-4xl xl:text-5xl font-black leading-[1.05] tracking-tight text-[#F0EDE8]">
              {data.title}
            </h2>

            {data.description && (
              <p className="text-[#F0EDE8]/60 text-base max-w-lg leading-relaxed">
                {data.description}
              </p>
            )}

            <div className="flex gap-4 mt-2">
              <Link href={data.ctaPrimary.href} className="bg-[#E63012] hover:bg-[#B8240C] text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#E63012]/20 text-base">
                <span className="material-symbols-outlined">play_circle</span>
                {data.ctaPrimary.label}
              </Link>
              <Link href={data.ctaSecondary.href} className="bg-[#0D2347]/40 backdrop-blur-md border border-[#0D2347] text-[#F0EDE8] px-8 py-3.5 rounded-xl font-bold transition-all hover:bg-[#0D2347]/60 text-base">
                {data.ctaSecondary.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
