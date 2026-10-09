// src/components/HeroSection.tsx
import React from 'react';
import {
  ChevronRight,
  Fish,
  Waves,
  MapPin,
  Play,
  Sparkles,
} from 'lucide-react';
import { aquacultureService } from '../services/aquacultureService';

interface HeroSectionProps {
  onViewPondDetails: () => void;
  onOpenTimetable: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onViewPondDetails,
  onOpenTimetable,
}) => {
  const farmSetup = aquacultureService.getFarmSetup();
  const biomassKg = aquacultureService.getBiomassKg();
  const deadFish = aquacultureService.getDeadFishToday();
  const liveCount = Math.max(0, farmSetup.stockCount - deadFish);

  return (
    <section className="relative overflow-hidden bg-white/60 border border-[#dcebfa] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm shadow-[#0789F9]/5">
      {/* BACKGROUND ORGANIC WATER BLOBS & WAVE TRACES */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#08B9E8]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-[#0789F9]/8 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#087A91]/10 rounded-full blur-3xl pointer-events-none" />

      {/* SVG DECORATIVE FLOWING CURVES AROUND HERO */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none stroke-[#08B9E8]/20"
        fill="none"
        strokeWidth="1.5"
      >
        <path d="M-50,80 Q250,20 450,160 T950,110 T1450,240" />
        <path d="M100,320 Q350,200 650,340 T1200,280" opacity="0.6" />
      </svg>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* LEFT COLUMN: HERO TEXT & ACTIONS (4 cols) */}
        <div className="lg:col-span-4 space-y-4 text-left">
          {/* EYEBROW TAGLINE */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f7fe] border border-[#d6e8f7]">
            <Sparkles className="w-3.5 h-3.5 text-[#0789F9]" />
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#0789F9]">
              HEALTHY WATER · HEALTHY FISH · BETTER YIELDS
            </span>
          </div>

          {/* LARGE HEADINGS */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#12365F] tracking-tight leading-none">
              JalDrishti
            </h1>
            <h2 className="text-xl sm:text-2xl font-bold text-[#087A91] mt-2">
              Smart Monitoring. Smart Feeding.
            </h2>
          </div>

          {/* SHORT SUPPORTING DESCRIPTION */}
          <p className="text-sm text-[#547392] leading-relaxed">
            Real-time optical DO telemetry, automated FAO growth curve analytics,
            and precision feeding rates designed for high-density commercial aquaculture ponds.
          </p>

          {/* BUTTON ACTIONS */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onViewPondDetails}
              className="px-6 py-3 rounded-full bg-[#0789F9] hover:bg-[#0574d6] text-white font-bold text-sm shadow-md shadow-[#0789F9]/25 hover:shadow-lg hover:shadow-[#0789F9]/35 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>View Pond Details</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={onOpenTimetable}
              className="px-5 py-3 rounded-full bg-white hover:bg-[#f0f7fe] text-[#0789F9] font-semibold text-sm border border-[#d6e8f7] transition-colors"
            >
              Daily Timetable
            </button>
          </div>
        </div>

        {/* CENTER COLUMN: ORGANIC ASYMMETRICAL FISH IMAGE MASK (4 cols) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center relative">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72">
            {/* LAYER 1: OUTER CYAN ORGANIC BLOB */}
            <div className="absolute -inset-3 bg-[#08B9E8]/30 blob-bg-cyan transform rotate-6 animate-pulse" />

            {/* LAYER 2: VIVID BLUE ORGANIC SHAPE BEHIND IMAGE */}
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#0789F9] to-[#08B9E8] blob-bg-blue transform -rotate-3 shadow-lg shadow-[#0789F9]/20" />

            {/* LAYER 3: ASYMMETRICAL EGG/BLOB MASK CONTAINING SWIMMING FISH */}
            <div className="relative w-full h-full blob-mask-fish border-4 border-white shadow-xl overflow-hidden bg-sky-100">
              <img
                src="/images/swimming_fish.jpg"
                alt="Healthy fish swimming in clear pond water"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />

              {/* OVERLAY TINT */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#12365F]/30 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* FLOATING PLAY / ACTION BADGE (matching the reference image's video play badge!) */}
            <div className="absolute top-2 right-2 w-11 h-11 rounded-full bg-[#0789F9] text-white flex items-center justify-center shadow-md shadow-[#0789F9]/40 border-2 border-white hover:scale-110 transition-transform cursor-pointer">
              <Play className="w-4 h-4 fill-white translate-x-0.5" />
            </div>

            {/* FLOATING SPECIES BADGE */}
            <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full shadow-md border border-[#d6e8f7] flex items-center gap-1.5">
              <Fish className="w-3.5 h-3.5 text-[#0789F9]" />
              <span className="text-[11px] font-bold text-[#12365F]">
                Tilapia · 40g Fingerling
              </span>
            </div>
          </div>

          {/* HANDWRITTEN-STYLE PHRASE BESIDE THE FISH IMAGE */}
          <div className="mt-3 text-center sm:text-right w-full pr-4 flex items-center justify-center gap-2">
            <span className="font-handwriting text-xl sm:text-2xl text-[#087A91] font-bold transform -rotate-2 inline-block">
              "Better Feeds, Healthier Farms"
            </span>
            <svg
              className="w-6 h-6 text-[#08B9E8] transform -rotate-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </div>
        </div>

        {/* RIGHT COLUMN: POND OVERVIEW PANEL WITH ORGANIC ACCENT (4 cols) */}
        <div className="lg:col-span-4">
          <div className="relative ocean-card p-5 space-y-4 border border-[#dcebfa] overflow-hidden">
            {/* ORGANIC WAVE ACCENT ALONG THE EDGE */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#08B9E8]/10 rounded-full blur-xl pointer-events-none" />

            {/* HEADER */}
            <div className="flex items-center justify-between pb-3 border-b border-[#e2eef9]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#0789F9]/10 text-[#0789F9] flex items-center justify-center">
                  <Waves className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#12365F] text-sm leading-tight">
                    Pond Overview
                  </h3>
                  <span className="text-[11px] text-[#547392] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#0789F9]" />
                    {farmSetup.farmName}
                  </span>
                </div>
              </div>

              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Active Cycle
              </span>
            </div>

            {/* REALISTIC POND THUMBNAIL */}
            <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-[#d6e8f7] group shadow-inner">
              <img
                src="/images/pond_overview.jpg"
                alt="Aerial view of aquaculture pond"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12365F]/80 via-transparent to-transparent flex items-end p-3">
                <div className="text-white">
                  <div className="font-bold text-xs">{farmSetup.pondName}</div>
                  <div className="text-[10px] text-white/80">Surface Area: 1.2 Hectares (12,000 m²)</div>
                </div>
              </div>
            </div>

            {/* POND METRIC ATTRIBUTES */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#f0f7fe] p-2.5 rounded-xl border border-[#d6e8f7]">
                <span className="text-[10px] font-semibold text-[#547392] block uppercase">
                  Cultured Species
                </span>
                <span className="font-bold text-[#12365F] text-xs truncate block mt-0.5">
                  Nile Tilapia
                </span>
              </div>

              <div className="bg-[#f0f7fe] p-2.5 rounded-xl border border-[#d6e8f7]">
                <span className="text-[10px] font-semibold text-[#547392] block uppercase">
                  Stocking Density
                </span>
                <span className="font-bold text-[#12365F] text-xs block mt-0.5">
                  12.5 fish / m²
                </span>
              </div>

              <div className="bg-[#f0f7fe] p-2.5 rounded-xl border border-[#d6e8f7]">
                <span className="text-[10px] font-semibold text-[#547392] block uppercase">
                  Live Population
                </span>
                <span className="font-bold text-[#0789F9] font-mono text-xs block mt-0.5">
                  {liveCount.toLocaleString()} fish
                </span>
              </div>

              <div className="bg-[#f0f7fe] p-2.5 rounded-xl border border-[#d6e8f7]">
                <span className="text-[10px] font-semibold text-[#547392] block uppercase">
                  Current Biomass
                </span>
                <span className="font-bold text-emerald-700 font-mono text-xs block mt-0.5">
                  {biomassKg} kg
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
