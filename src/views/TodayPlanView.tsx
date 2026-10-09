// src/views/TodayPlanView.tsx
import React, { useState } from 'react';
import {
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Clock,
  Sparkles,
  Utensils,
  AlertTriangle,
} from 'lucide-react';
import { aquacultureService, type AppMealItem } from '../services/aquacultureService';
import { HeroSection } from '../components/HeroSection';
import { FullTimetableModal } from '../components/FullTimetableModal';
import { WhyAmountModal } from '../components/WhyAmountModal';
import { CheckinModal } from '../components/CheckinModal';
import { PLACEHOLDER_LIMITS } from '../data';

interface TodayPlanViewProps {
  onStartFeeding: (meal?: AppMealItem) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const TodayPlanView: React.FC<TodayPlanViewProps> = ({
  onStartFeeding,
  onNavigateToTab,
}) => {
  const nextMeal = aquacultureService.getNextMeal();
  const meals = aquacultureService.getMeals();
  const telemetry = aquacultureService.getTelemetry();
  const farmSetup = aquacultureService.getFarmSetup();
  const biomassKg = aquacultureService.getBiomassKg();

  const [showTimetable, setShowTimetable] = useState(false);
  const [showWhyAmount, setShowWhyAmount] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);

  const isCriticalDO = telemetry.liveDO < PLACEHOLDER_LIMITS.oxygen.stopLevelMgL;

  const currentMealIndex = nextMeal ? nextMeal.sessionIndex : 1;
  const totalPlannedKg = nextMeal ? nextMeal.plannedKg : 2.3;
  const feedCodeName = nextMeal ? nextMeal.feedCode : 'Feed X';
  const pelletSize = nextMeal ? nextMeal.pelletSizeMm : 2.0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* CRITICAL OXYGEN WARNING BANNER (ONLY IF LIVE DO DROPS BELOW 3.0) */}
      {isCriticalDO && (
        <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 text-rose-950 flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-rose-800">
                MANDATORY SAFETY STOP ENFORCED
              </div>
              <div className="text-sm font-bold">
                Live Dissolved Oxygen is {telemetry.liveDO.toFixed(1)} mg/L (Below Stop Limit 3.0 mg/L).
              </div>
              <div className="text-xs text-rose-800">
                Fish feeding is safely halted. Emergency aerators activated.
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab?.('meals')}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold shrink-0"
          >
            Inspect Gate
          </button>
        </div>
      )}

      {/* LAST MORTALITY CONFIRMATION BANNER */}
      {aquacultureService.getLastMortalityConfirmation() && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-emerald-950 flex items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-2.5 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{aquacultureService.getLastMortalityConfirmation()}</span>
          </div>
          <button
            onClick={() => setShowCheckin(true)}
            className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-white hover:bg-emerald-100/60 px-3 py-1 rounded-lg border border-emerald-300 transition-colors shrink-0 cursor-pointer"
          >
            Update Check-in
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 1. TOP SECTION: POND OVERVIEW & BIOLOGICAL CONTEXT (NOW AT TOP)*/}
      {/* ============================================================== */}
      <section className="space-y-3">
        {/* DESKTOP FULL HERO SECTION WITH POND & SWIMMING FISH */}
        <div className="hidden lg:block">
          <HeroSection
            onViewPondDetails={() => onNavigateToTab?.('water')}
            onOpenTimetable={() => setShowTimetable(true)}
          />
        </div>

        {/* MOBILE COMPACT POND OVERVIEW CARD */}
        <div className="lg:hidden ocean-card p-4 bg-gradient-to-r from-white via-[#f0f7fe] to-white border border-[#dcebfa]">
          <div className="flex items-center gap-3">
            <img
              src="/images/pond_overview.jpg"
              alt="Pond thumbnail"
              className="w-16 h-16 rounded-xl object-cover border border-[#d6e8f7] shrink-0 shadow-xs"
            />

            <div className="flex-1 min-w-0">
              <div className="font-bold text-xs text-[#12365F] truncate">
                {farmSetup.pondName} · {farmSetup.farmName}
              </div>
              <div className="text-[11px] text-[#547392] truncate mt-0.5">
                Nile Tilapia · {biomassKg} kg Live Biomass
              </div>
              <div className="font-handwriting text-sm text-[#087A91] font-bold mt-0.5">
                "Better Feeds, Healthier Farms"
              </div>
            </div>

            <div className="w-12 h-12 blob-mask-fish border-2 border-white shadow-xs shrink-0 overflow-hidden bg-sky-100">
              <img
                src="/images/swimming_fish.jpg"
                alt="Fish thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. SECOND SECTION: FEEDING SCHEDULE & PRESCRIPTION BOX         */}
      {/* ============================================================== */}
      <section className="space-y-4">
        {/* DESKTOP 2-COLUMN VIEW (>= lg) */}
        <div className="hidden lg:grid grid-cols-12 gap-6">
          {/* LEFT: NEXT FEEDING PRESCRIPTION CARD (7 cols) */}
          <div className="col-span-7 ocean-card p-6 space-y-5 border-2 border-[#0789F9]/20 shadow-md shadow-[#0789F9]/5 flex flex-col justify-between">
            <div className="space-y-4">
              {/* HEADER */}
              <div className="flex items-center justify-between pb-3 border-b border-[#e2eef9]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#0789F9]/10 text-[#0789F9] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h2 className="font-bold text-[#12365F] text-base">
                      Next Feeding Prescription
                    </h2>
                    <span className="text-xs text-[#547392]">
                      Session {currentMealIndex} of {meals.length} Scheduled Today
                    </span>
                  </div>
                </div>

                {/* AI / SAFETY BADGE */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0fdf4] border border-emerald-200 text-emerald-800 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  AI Suggestion · Optimal Window
                </span>
              </div>

              {/* TARGET FEED PRODUCT BANNER */}
              <div className="flex items-center justify-between bg-[#f0f7fe] p-4 rounded-2xl border border-[#d6e8f7]">
                <div>
                  <span className="text-[10px] font-semibold text-[#547392] uppercase tracking-wider block">
                    Target Feed Formulation
                  </span>
                  <div className="font-extrabold text-lg text-[#12365F] mt-0.5">
                    {feedCodeName}
                  </div>
                  <div className="text-xs text-[#087A91] font-semibold">
                    {pelletSize} mm Floating Pellets · {farmSetup.currentStageName || 'Fingerling'} Stage
                  </div>
                </div>

                {/* PELLET GRAPHICAL BADGE */}
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#d6e8f7] flex items-center justify-center shadow-xs">
                  <div className="grid grid-cols-2 gap-1 p-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-700" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-800" />
                  </div>
                </div>
              </div>

              {/* MEASUREMENTS GRID */}
              <div className="grid grid-cols-2 gap-4">
                {/* RATION AMOUNT */}
                <div className="bg-white p-4 rounded-2xl border border-[#e2eef9]">
                  <span className="text-[10px] font-semibold text-[#547392] uppercase block">
                    Recommended Ration
                  </span>
                  <div className="text-3xl font-extrabold text-[#0789F9] font-mono leading-tight mt-1">
                    {totalPlannedKg} <span className="text-sm font-sans font-semibold text-[#12365F]">kg</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Bio-optimized for live biomass
                  </span>
                </div>

                {/* WINDOW & DO */}
                <div className="bg-white p-4 rounded-2xl border border-[#e2eef9]">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-semibold text-[#547392] uppercase">
                      Scheduled Window
                    </span>
                    <span className="text-[11px] font-mono text-emerald-700 font-bold">
                      DO {telemetry.liveDO.toFixed(1)} mg/L
                    </span>
                  </div>
                  <div className="text-xl font-bold text-[#12365F] font-mono mt-1">
                    {nextMeal ? nextMeal.time : '08:30 AM'}
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Safe to feed (DO &gt; 5.0)
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#547392] leading-relaxed">
                Calculated via scientific FAO growth rate tables. Automatically adjusted for water temperature ({telemetry.liveTemp.toFixed(1)}°C) and observed feed clearance.
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-3 border-t border-[#e2eef9] flex items-center gap-3">
              <button
                onClick={() => onStartFeeding(nextMeal)}
                className="flex-1 py-3 px-5 rounded-xl bg-[#0789F9] hover:bg-[#0574d6] active:scale-[0.99] text-white text-sm font-bold shadow-md shadow-[#0789F9]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                <span>Start Feeding & Log Session</span>
              </button>

              <button
                onClick={() => setShowWhyAmount(true)}
                className="py-3 px-4 rounded-xl bg-[#f0f7fe] hover:bg-[#e4f1fc] text-[#0789F9] text-xs font-semibold border border-[#d6e8f7] transition-colors"
                title="Mathematical formula & calculation explanation"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT: TODAY'S FEEDING SESSIONS TIMELINE & LOG (5 cols) */}
          <div className="col-span-5 ocean-card p-6 space-y-4 border-2 border-[#0789F9]/20 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#e2eef9]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#0789F9]/10 text-[#0789F9] flex items-center justify-center">
                    <Utensils className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#12365F] text-sm">
                      Today's Feeding Schedule
                    </h3>
                    <span className="text-[10px] text-[#547392]">
                      Daily Session Breakdown
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowTimetable(true)}
                  className="text-xs font-semibold text-[#0789F9] hover:underline"
                >
                  Full Timetable
                </button>
              </div>

              {/* SESSIONS LIST */}
              <div className="space-y-2.5">
                {meals.map((meal) => {
                  const isGiven = meal.status === 'Given';
                  const isSkipped = meal.status === 'Skipped';
                  const isReduced = meal.status === 'Reduced';
                  const isPending = meal.status === 'Pending';

                  return (
                    <div
                      key={meal.id}
                      onClick={() => isPending && onStartFeeding(meal)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                        isPending
                          ? 'border-[#0789F9]/40 bg-[#f8fbfe] hover:bg-[#f0f7fe] cursor-pointer shadow-2xs'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-sm text-[#0789F9]">
                          {meal.time}
                        </span>
                        <div>
                          <div className="font-bold text-[#12365F]">
                            Meal {meal.sessionIndex} · <strong>{meal.plannedKg} kg</strong>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {meal.feedCode} ({meal.pelletSizeMm}mm)
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            isGiven
                              ? 'bg-emerald-100 text-emerald-800'
                              : isSkipped
                              ? 'bg-rose-100 text-rose-800'
                              : isReduced
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-sky-100 text-[#0789F9]'
                          }`}
                        >
                          {meal.status}
                        </span>
                        {isPending && (
                          <ChevronRight className="w-3.5 h-3.5 text-[#0789F9]" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-[#e2eef9] flex items-center justify-between text-xs text-[#547392]">
              <span>Total Planned Today:</span>
              <span className="font-mono font-bold text-[#12365F] text-sm">
                {meals.reduce((acc, m) => acc + m.plannedKg, 0).toFixed(1)} kg
              </span>
            </div>
          </div>
        </div>

        {/* MOBILE STACKED VIEW (< lg) */}
        <div className="lg:hidden space-y-4">
          {/* MOBILE NEXT FEEDING PRESCRIPTION CARD */}
          <div className="ocean-card p-4 space-y-3 border-2 border-[#0789F9]/30 bg-gradient-to-b from-white to-[#f4f9fd] shadow-md shadow-[#0789F9]/10">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e8f4fd] text-[#0789F9] text-[11px] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next Feeding · Meal {currentMealIndex} of {meals.length}</span>
              </span>

              <span className="text-xs font-mono font-bold text-[#12365F] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#0789F9]" />
                <span>{nextMeal ? nextMeal.time : '08:30 AM'}</span>
              </span>
            </div>

            {/* NUMBERS */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#d6e8f7] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#547392] block">
                  Prescribed Portion
                </span>
                <div className="text-3xl font-extrabold text-[#0789F9] font-mono leading-none mt-1">
                  {totalPlannedKg} <span className="text-sm font-sans font-semibold text-[#12365F]">kg</span>
                </div>
                <div className="text-xs font-semibold text-[#087A91] mt-1">
                  {feedCodeName} ({pelletSize} mm Floating)
                </div>
              </div>

              <div className="text-right flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold text-[#547392] block">
                  Probe DO
                </span>
                <div className="font-mono font-bold text-sm text-[#12365F] mt-1">
                  {telemetry.liveDO.toFixed(1)} mg/L
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 mt-0.5">
                  Safe to Feed
                </span>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="pt-1 flex items-center gap-2">
              <button
                onClick={() => onStartFeeding(nextMeal)}
                className="flex-1 py-3.5 px-4 rounded-xl bg-[#0789F9] hover:bg-[#0574d6] active:scale-[0.99] text-white text-sm font-bold shadow-md shadow-[#0789F9]/30 transition-all flex items-center justify-center gap-2 touch-target cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                <span>Start Feeding & Log Meal</span>
              </button>

              <button
                onClick={() => setShowWhyAmount(true)}
                className="py-3.5 px-3 rounded-xl bg-[#f0f7fe] hover:bg-[#e4f1fc] text-[#0789F9] text-xs font-semibold border border-[#d6e8f7] transition-colors touch-target"
                title="Calculation rationale"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* MOBILE TODAY'S SESSIONS LIST */}
          <div className="ocean-card p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#e2eef9]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0789F9]/10 text-[#0789F9] flex items-center justify-center">
                  <Utensils className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
                <h3 className="font-bold text-[#12365F] text-xs">
                  Today's Feeding Schedule
                </h3>
              </div>

              <button
                onClick={() => setShowTimetable(true)}
                className="text-xs font-semibold text-[#0789F9] hover:underline"
              >
                Full Schedule
              </button>
            </div>

            <div className="space-y-2">
              {meals.map((meal) => {
                const isGiven = meal.status === 'Given';
                const isSkipped = meal.status === 'Skipped';
                const isReduced = meal.status === 'Reduced';
                const isPending = meal.status === 'Pending';

                return (
                  <div
                    key={meal.id}
                    onClick={() => isPending && onStartFeeding(meal)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                      isPending
                        ? 'border-[#0789F9]/40 bg-[#f8fbfe] cursor-pointer hover:bg-[#f0f7fe]'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-xs text-[#0789F9]">
                        {meal.time}
                      </span>
                      <div>
                        <div className="font-bold text-[#12365F]">
                          Meal {meal.sessionIndex} · {meal.plannedKg} kg
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {meal.feedCode} ({meal.pelletSizeMm}mm)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isGiven
                            ? 'bg-emerald-100 text-emerald-800'
                            : isSkipped
                            ? 'bg-rose-100 text-rose-800'
                            : isReduced
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-sky-100 text-[#0789F9]'
                        }`}
                      >
                        {meal.status}
                      </span>
                      {isPending && (
                        <ChevronRight className="w-3.5 h-3.5 text-[#0789F9]" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* MODALS */}
      <FullTimetableModal
        isOpen={showTimetable}
        onClose={() => setShowTimetable(false)}
        onSelectMealForFeeding={(m) => {
          setShowTimetable(false);
          onStartFeeding(m);
        }}
      />

      <WhyAmountModal
        isOpen={showWhyAmount}
        onClose={() => setShowWhyAmount(false)}
      />

      <CheckinModal
        isOpen={showCheckin}
        onClose={() => setShowCheckin(false)}
      />
    </div>
  );
};
