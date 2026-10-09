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
import { BlobMask } from './waves/BlobMask';

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

  // Calibrated stocking density: 15,000 fish / 12,000 m² (1.2 ha) = 1.25 fish/m²
  const pondAreaM2 = 12000;
  const stockingDensity = (liveCount / pondAreaM2).toFixed(2);

  return (
    <section className="relative overflow-hidden bg-white/70 border border-[#dcebfa] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm shadow-[#0789F9]/5">
      {/* BACKGROUND ORGANIC WATER BLOBS & WAVE TRACES */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -left-24 w-96 h-96 bg-[#08B9E8]/10 rounded-full blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/3 w-80 h-80 bg-[#0789F9]/8 rounded-full blur-2xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#087A91]/10 rounded-full blur-3xl pointer-events-none"
      />

      {/* SVG DECORATIVE FLOWING CURVES AROUND HERO */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none stroke-[#08B9E8]/20"
        fill="none"
        strokeWidth="1.5"
      >
        <path d="M-50,80 Q250,20 450,160 T950,110 T1450,240" />
        <path d="M100,320 Q350,200 650,340 T1200,280" opacity="0.6" />
      </svg>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* ============================================================== */}
        {/* LEFT COLUMN: HERO TEXT & ACTIONS (4 cols)                       */}
        {/* ============================================================== */}
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
            and precision feeding rates calibrated for 15,000 fingerlings.
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
              className="px-5 py-3 rounded-full bg-white hover:bg-[#f0f7fe] text-[#0789F9] font-semibold text-sm border border-[#d6e8f7] transition-colors cursor-pointer"
            >
              Daily Timetable
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* CENTER COLUMN: ORGANIC BLOB MASK & SCRIPT TAGLINE (4 cols)     */}
        {/* ============================================================== */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center relative">
          <div className="relative flex items-center justify-center">
            {/* ORGANIC BLOB MASK WITH FISH PHOTO & OFFSET OUTLINE BLOB */}
            <BlobMask
              src="/images/swimming_fish.jpg"
              alt="Healthy swimming fish in clear pond water"
              width={270}
              height={270}
              className="transform hover:scale-[1.02] transition-transform duration-500"
            />

            {/* FLOATING VIDEO PLAY / ACTION BADGE */}
            <div
              className="absolute top-2 right-4 w-11 h-11 rounded-full bg-[#0789F9] text-white flex items-center justify-center shadow-md shadow-[#0789F9]/40 border-2 border-white hover:scale-110 transition-transform cursor-pointer z-20"
              title="Watch pond feeding activity"
            >
              <Play className="w-4 h-4 fill-white translate-x-0.5" />
            </div>

            {/* FLOATING SPECIES BADGE */}
            <div className="absolute bottom-2 left-4 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full shadow-md border border-[#d6e8f7] flex items-center gap-1.5 z-20">
              <Fish className="w-3.5 h-3.5 text-[#0789F9]" />
              <span className="text-[11px] font-bold text-[#12365F]">
                Tilapia · 12g Fingerling
              </span>
            </div>
          </div>

          {/* SCRIPT TAGLINE STACKED ON TWO LINES WITH SMALL WAVE UNDERLINE */}
          <div className="mt-3 flex flex-col items-center text-center">
            <span className="font-handwriting text-2xl sm:text-3xl text-[#087A91] font-bold leading-tight transform -rotate-1">
              Better Feeds
            </span>
            <span className="font-handwriting text-2xl sm:text-3xl text-[#0789F9] font-bold leading-tight transform -rotate-1">
              Healthier Farms
            </span>

            {/* SMALL SVG WAVE UNDERLINE */}
            <svg
              aria-hidden="true"
              className="w-36 h-3 text-[#08B9E8] mt-1"
              viewBox="0 0 140 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M2,6 C25,1 45,11 70,6 C95,1 115,11 138,6" />
            </svg>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: POND OVERVIEW PANEL WITH BLEEDING WAVES (4 cols) */}
        {/* ============================================================== */}
        <div className="lg:col-span-4">
          <div className="relative ocean-card p-5 space-y-4 border border-[#dcebfa] overflow-hidden">
            {/* BLUE WAVE SHAPES BLEEDING OFF TOP-RIGHT & BOTTOM-RIGHT EDGES */}
            <div
              aria-hidden="true"
              className="absolute top-0 right-0 w-36 h-36 pointer-events-none opacity-25 overflow-hidden"
            >
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-[#0789F9]"
                fill="currentColor"
              >
                <path d="M100,0 L30,0 C50,30 30,70 100,100 Z" />
              </svg>
            </div>

            <div
              aria-hidden="true"
              className="absolute bottom-0 right-0 w-44 h-28 pointer-events-none opacity-20 overflow-hidden"
            >
              <svg
                viewBox="0 0 160 100"
                className="w-full h-full text-[#08B9E8]"
                fill="currentColor"
              >
                <path d="M160,100 L0,100 C40,70 80,95 120,60 C140,40 150,20 160,0 Z" />
              </svg>
            </div>

            {/* HEADER */}
            <div className="relative z-10 flex items-center justify-between pb-3 border-b border-[#e2eef9]">
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
            <div className="relative z-10 w-full h-32 rounded-2xl overflow-hidden border border-[#d6e8f7] group shadow-inner">
              <img
                src="/images/pond_overview.jpg"
                alt="Aerial view of aquaculture pond"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12365F]/85 via-transparent to-transparent flex items-end p-3">
                <div className="text-white">
                  <div className="font-bold text-xs">{farmSetup.pondName}</div>
                  <div className="text-[10px] text-white/85">
                    Surface Area: 1.2 Hectares (12,000 m²)
                  </div>
                </div>
              </div>
            </div>

            {/* POND METRIC ATTRIBUTES */}
            <div className="relative z-10 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#f0f7fe]/90 backdrop-blur-2xs p-2.5 rounded-xl border border-[#d6e8f7]">
                <span className="text-[10px] font-semibold text-[#547392] block uppercase">
                  Cultured Species
                </span>
                <span className="font-bold text-[#12365F] text-xs truncate block mt-0.5">
                  Nile Tilapia (12g)
                </span>
              </div>

              <div className="bg-[#f0f7fe]/90 backdrop-blur-2xs p-2.5 rounded-xl border border-[#d6e8f7]">
                <span className="text-[10px] font-semibold text-[#547392] block uppercase">
                  Stocking Density
                </span>
                <span className="font-bold text-[#12365F] text-xs block mt-0.5">
                  {stockingDensity} fish / m²
                </span>
              </div>

              <div className="bg-[#f0f7fe]/90 backdrop-blur-2xs p-2.5 rounded-xl border border-[#d6e8f7]">
                <span className="text-[10px] font-semibold text-[#547392] block uppercase">
                  Live Population
                </span>
                <span className="font-bold text-[#0789F9] font-mono text-xs block mt-0.5">
                  {liveCount.toLocaleString()} fish
                </span>
              </div>

              <div className="bg-[#f0f7fe]/90 backdrop-blur-2xs p-2.5 rounded-xl border border-[#d6e8f7]">
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
