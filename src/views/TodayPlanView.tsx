// src/views/TodayPlanView.tsx
import React, { useState } from 'react';
import {
  AlertTriangle,
  HelpCircle,
  Droplets,
  ShieldCheck,
  ChevronRight,
  Cpu,
  Package,
  Clock,
  Sparkles,
  X,
  Wind,
  Utensils,
} from 'lucide-react';
import { aquacultureService, type AppMealItem } from '../services/aquacultureService';
import { HeroSection } from '../components/HeroSection';
import { WaterQualityTrendChart } from '../components/WaterQualityTrendChart';
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
  const inventory = aquacultureService.getFeedInventory();
  const farmSetup = aquacultureService.getFarmSetup();
  const biomassKg = aquacultureService.getBiomassKg();

  const [showTimetable, setShowTimetable] = useState(false);
  const [showWhyAmount, setShowWhyAmount] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  // Find short stock batch
  const shortBatch = inventory.find((b) => b.isShortStock || b.daysLeft < 3.0);

  const isCriticalDO = telemetry.liveDO < PLACEHOLDER_LIMITS.oxygen.stopLevelMgL;
  const isCautionDO =
    telemetry.liveDO >= PLACEHOLDER_LIMITS.oxygen.stopLevelMgL &&
    telemetry.liveDO < PLACEHOLDER_LIMITS.oxygen.fullFeedingLevelMgL;

  const currentMealIndex = nextMeal ? nextMeal.sessionIndex : 1;
  const totalPlannedKg = nextMeal ? nextMeal.plannedKg : 2.3;
  const feedCodeName = nextMeal ? nextMeal.feedCode : 'Feed X';
  const pelletSize = nextMeal ? nextMeal.pelletSizeMm : 2.0;

  return (
    <div className="space-y-6">
      {/* ============================================================== */}
      {/* MOBILE PHONE-FIRST OPERATIONAL FLOW (< lg viewports) */}
      {/* 1. Next Feeding Schedule & Direct Log Button at the very top  */}
      {/* 2. Today's Meal Sessions Timeline / Log                       */}
      {/* 3. Real-Time Water Quality 4-Pack                              */}
      {/* 4. Compact Pond & Fish Image Visuals (small thumbnails)        */}
      {/* ============================================================== */}
      <div className="lg:hidden space-y-4">
        {/* MOBILE NEXT FEEDING PRESCRIPTION CARD (FRONT & CENTER) */}
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

          {/* PRESCRIPTION NUMBERS */}
          <div className="bg-white p-3 rounded-2xl border border-[#d6e8f7] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#547392] block">
                Prescribed Feed Portion
              </span>
              <div className="text-3xl font-extrabold text-[#0789F9] font-mono leading-none mt-1">
                {totalPlannedKg} <span className="text-sm font-sans font-semibold text-[#12365F]">kg</span>
              </div>
              <div className="text-xs font-semibold text-[#087A91] mt-1">
                {feedCodeName} ({pelletSize} mm Floating)
              </div>
            </div>

            {/* DO STATUS BADGE */}
            <div className="text-right flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold text-[#547392] block">
                Pre-Meal Probe DO
              </span>
              <div className="flex items-center gap-1.5 mt-1 font-mono font-bold text-sm text-[#12365F]">
                <span>{telemetry.liveDO.toFixed(1)} mg/L</span>
                <span
                  className={`status-pip ${
                    isCriticalDO
                      ? 'status-pip-critical'
                      : isCautionDO
                      ? 'status-pip-caution'
                      : 'status-pip-safe'
                  }`}
                />
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 mt-0.5">
                {isCriticalDO ? 'Oxygen Stop (<3.0)' : isCautionDO ? 'Reduced Portion' : 'Safe to Feed'}
              </span>
            </div>
          </div>

          {/* PRIMARY TOUCH ACTION: START FEEDING & LOG MEAL */}
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

        {/* TODAY'S FEEDING SESSIONS SCHEDULE & LOG */}
        <div className="ocean-card p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#e2eef9]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#0789F9]/10 text-[#0789F9] flex items-center justify-center">
                <Utensils className="w-3.5 h-3.5 stroke-[2.2]" />
              </div>
              <h3 className="font-bold text-[#12365F] text-xs">
                Today's Feeding Schedule & Log
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

        {/* MOBILE WATER QUALITY 4-PACK */}
        <div className="ocean-card p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#e2eef9]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#08B9E8]/15 text-[#0789F9] flex items-center justify-center">
                <Droplets className="w-3.5 h-3.5 stroke-[2.2]" />
              </div>
              <h3 className="font-bold text-[#12365F] text-xs">
                Live Water Quality Telemetry
              </h3>
            </div>

            <button
              onClick={() => onNavigateToTab?.('water')}
              className="text-xs font-semibold text-[#0789F9] hover:underline"
            >
              Details
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="ocean-card-subtle p-2.5">
              <div className="flex justify-between items-center text-[11px] text-[#547392]">
                <span>DO (mg/L)</span>
                <span className={`status-pip ${isCriticalDO ? 'status-pip-critical' : isCautionDO ? 'status-pip-caution' : 'status-pip-safe'}`} />
              </div>
              <div className="text-xl font-bold font-mono text-[#12365F] mt-0.5">
                {telemetry.liveDO.toFixed(1)}
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">Safe: &gt;5.0</span>
            </div>

            <div className="ocean-card-subtle p-2.5">
              <div className="flex justify-between items-center text-[11px] text-[#547392]">
                <span>Temp (°C)</span>
                <span className="status-pip status-pip-safe" />
              </div>
              <div className="text-xl font-bold font-mono text-[#12365F] mt-0.5">
                {telemetry.liveTemp.toFixed(1)}°
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">Safe: 26–32°</span>
            </div>

            <div className="ocean-card-subtle p-2.5">
              <div className="flex justify-between items-center text-[11px] text-[#547392]">
                <span>pH Level</span>
                <span className="status-pip status-pip-safe" />
              </div>
              <div className="text-xl font-bold font-mono text-[#12365F] mt-0.5">
                7.8
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">Safe: 6.5–8.5</span>
            </div>

            <div className="ocean-card-subtle p-2.5">
              <div className="flex justify-between items-center text-[11px] text-[#547392]">
                <span>Salinity</span>
                <span className="status-pip status-pip-safe" />
              </div>
              <div className="text-xl font-bold font-mono text-[#12365F] mt-0.5">
                1.2 <span className="text-xs font-normal">ppt</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">Safe: 0.5–3.0</span>
            </div>
          </div>
        </div>

        {/* COMPACT POND & FISH VISUAL CARD WITH SMALL THUMBNAILS (MOBILE) */}
        <div className="ocean-card p-3.5 bg-gradient-to-r from-white via-[#f0f7fe] to-white border border-[#dcebfa]">
          <div className="flex items-center gap-3">
            {/* Small Pond Overview Thumbnail */}
            <img
              src="/images/pond_overview.jpg"
              alt="Pond thumbnail"
              className="w-16 h-16 rounded-xl object-cover border border-[#d6e8f7] shrink-0 shadow-xs"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-[#12365F] truncate">
                  {farmSetup.pondName} · {farmSetup.farmName}
                </span>
              </div>
              <div className="text-[11px] text-[#547392] truncate mt-0.5">
                Nile Tilapia · {biomassKg} kg Biomass
              </div>
              <div className="font-handwriting text-sm text-[#087A91] font-bold mt-0.5">
                "Better Feeds, Healthier Farms"
              </div>
            </div>

            {/* Small Fish Organic Thumbnail */}
            <div className="w-12 h-12 blob-mask-fish border-2 border-white shadow-xs shrink-0 overflow-hidden bg-sky-100">
              <img
                src="/images/swimming_fish.jpg"
                alt="Fish thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* MOBILE SAFETY ALERT BANNER (IF ACTIVE) */}
        {shortBatch && !dismissedAlerts.includes('stock-banner-mobile') && (
          <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-3.5 text-[#92400E] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0" />
              <div>
                <span className="font-bold">Stock Short: {shortBatch.codeName}</span> ({shortBatch.daysLeft.toFixed(1)} days left)
              </div>
            </div>
            <button
              onClick={() => onNavigateToTab?.('inventory')}
              className="px-2.5 py-1 rounded-lg bg-[#F59E0B] text-white font-bold text-[10px] shrink-0"
            >
              Order
            </button>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* DESKTOP WEBSITE LAYOUT (>= lg viewports)                       */}
      {/* 1. TOP PRIORITY: NEXT FEEDING SCHEDULE, WATER QUALITY, TIMELINE */}
      {/* 2. OPERATIONAL GRID: TREND CHART, SENSORS, LOG & STOCK         */}
      {/* 3. AT THE END: SLID DOWN POND OVERVIEW & HERO SECTION          */}
      {/* ============================================================== */}
      <div className="hidden lg:block space-y-6">
        {/* SAFETY ALERT (HORIZONTAL PALE-AMBER BANNER WITH ORANGE WARNING ICON) */}
        {shortBatch && !dismissedAlerts.includes('stock-banner') && (
          <div className="relative bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-4 sm:p-5 text-[#92400E] shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center shrink-0 shadow-sm">
                <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#F59E0B]/20 text-[#B45309]">
                    Safety Alert
                  </span>
                  <span className="font-bold text-sm text-[#78350F]">
                    Stock short: {shortBatch.codeName} ({shortBatch.daysLeft.toFixed(1)} days left)
                  </span>
                </div>
                <p className="text-xs text-[#92400E] mt-0.5">
                  Remaining warehouse stock: <strong>{shortBatch.stockOnHandKg} kg</strong>.
                  Suggested action: order replacement bags or transition to Finisher pellets (3.0mm).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateToTab?.('inventory')}
                className="px-4 py-2 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white text-xs font-bold transition-colors shadow-xs"
              >
                Order / Transition Feed
              </button>
              <button
                onClick={() => setDismissedAlerts((prev) => [...prev, 'stock-banner'])}
                className="p-1.5 rounded-lg hover:bg-[#FEF3C7] text-[#92400E] transition-colors"
                title="Dismiss alert"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* CRITICAL DO WARNING IF SIMULATED BELOW THRESHOLD */}
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
                  Fish feeding is safely halted. Emergency paddlewheel aerators activated.
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigateToTab?.('meals')}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold"
            >
              Inspect Interlock
            </button>
          </div>
        )}

        {/* TOP PRIORITY: MAIN FEEDING OPERATIONS & WATER QUALITY GRID (12 COLS) */}
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT COLUMN: FEEDING RECOMMENDATION + WATER QUALITY + TREND CHART (8 cols) */}
          <div className="col-span-8 space-y-6">
            {/* TOP ROW: FEEDING RECOMMENDATION PANEL & WATER QUALITY SECTION */}
            <div className="grid grid-cols-12 gap-5">
              {/* E. FEEDING RECOMMENDATION PANEL (6 cols) */}
              <div className="col-span-6 ocean-card p-5 space-y-4 flex flex-col justify-between border-2 border-[#0789F9]/20 shadow-md shadow-[#0789F9]/5">
                <div>
                  {/* HEADER */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#e2eef9]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#0789F9]/10 text-[#0789F9] flex items-center justify-center">
                        <Sparkles className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#12365F] text-sm">
                          Feeding Recommendation
                        </h3>
                        <span className="text-[10px] text-[#547392]">
                          Meal {currentMealIndex} of {meals.length} Today
                        </span>
                      </div>
                    </div>

                    {/* AI SUGGESTION INDICATOR */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f0fdf4] border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      AI Suggestion
                    </span>
                  </div>

                  {/* FEED DETAILS & PELLET GRAPHIC */}
                  <div className="mt-4 flex items-center justify-between bg-[#f0f7fe] p-3.5 rounded-2xl border border-[#d6e8f7]">
                    <div>
                      <div className="text-[10px] font-semibold text-[#547392] uppercase tracking-wider">
                        Target Feed Product
                      </div>
                      <div className="font-bold text-base text-[#12365F]">
                        {feedCodeName}
                      </div>
                      <div className="text-xs text-[#087A91] font-semibold">
                        {pelletSize} mm Floating Pellets
                      </div>
                    </div>

                    {/* SMALL PELLET GRAPHICAL BADGE */}
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#d6e8f7] flex items-center justify-center shadow-xs">
                      <div className="grid grid-cols-2 gap-1 p-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-600/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-700" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-800" />
                      </div>
                    </div>
                  </div>

                  {/* RECOMMENDED QUANTITY & NEXT FEEDING TIME */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-xl border border-[#e2eef9]">
                      <span className="text-[10px] font-semibold text-[#547392] block uppercase">
                        Recommended Portion
                      </span>
                      <span className="text-2xl font-extrabold text-[#0789F9] font-mono block mt-0.5">
                        {totalPlannedKg} kg
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Bio-optimized for size
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#e2eef9]">
                      <span className="text-[10px] font-semibold text-[#547392] block uppercase">
                        Next Feeding Window
                      </span>
                      <span className="text-lg font-bold text-[#12365F] font-mono block mt-1">
                        {nextMeal ? nextMeal.time : '08:30 AM'}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold block">
                        Oxygen curve favorable
                      </span>
                    </div>
                  </div>

                  {/* SMALL EXPLANATION */}
                  <p className="mt-3 text-[11px] text-[#547392] leading-relaxed">
                    Recommendation computed from FAO Tilapia feeding table at {telemetry.liveTemp.toFixed(1)}°C.
                    Adjusted for observed dissolved oxygen curve and zero feed tray leftovers.
                  </p>
                </div>

                {/* ACTION BUTTONS */}
                <div className="mt-4 pt-3 border-t border-[#e2eef9] flex items-center gap-2">
                  <button
                    onClick={() => onStartFeeding(nextMeal)}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#0789F9] hover:bg-[#0574d6] text-white text-xs font-bold shadow-md shadow-[#0789F9]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                    <span>Start Feeding & Log Session</span>
                  </button>

                  <button
                    onClick={() => setShowWhyAmount(true)}
                    className="py-3 px-3 rounded-xl bg-[#f0f7fe] hover:bg-[#e4f1fc] text-[#0789F9] text-xs font-semibold border border-[#d6e8f7] transition-colors"
                    title="Mathematical explanation of feed quantity"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* F. WATER QUALITY SECTION (6 cols) */}
              <div className="col-span-6 ocean-card p-5 space-y-3 flex flex-col justify-between">
                {/* HEADER */}
                <div className="flex items-center justify-between pb-2 border-b border-[#e2eef9]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#08B9E8]/15 text-[#0789F9] flex items-center justify-center">
                      <Droplets className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#12365F] text-sm">
                        Water Quality Status
                      </h3>
                      <span className="text-[10px] text-[#547392]">
                        RS485 Modbus Telemetry
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigateToTab?.('water')}
                    className="text-xs font-semibold text-[#0789F9] hover:underline flex items-center gap-0.5"
                  >
                    <span>Detailed Telemetry</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 4 COMPACT LIGHTLY ROUNDED METRIC PANELS */}
                <div className="grid grid-cols-2 gap-2.5">
                  {/* 1. DISSOLVED OXYGEN */}
                  <div className="ocean-card-subtle p-3 space-y-1 hover:border-[#0789F9]/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#547392]">DO (mg/L)</span>
                      <span
                        className={`status-pip ${
                          isCriticalDO
                            ? 'status-pip-critical'
                            : isCautionDO
                            ? 'status-pip-caution'
                            : 'status-pip-safe'
                        }`}
                      />
                    </div>
                    <div className="text-xl font-bold font-mono text-[#12365F]">
                      {telemetry.liveDO.toFixed(1)} <span className="text-xs font-sans font-normal text-slate-500">mg/L</span>
                    </div>
                    <div className="text-[10px] font-medium text-emerald-700">
                      Safe Range: &gt; 5.0
                    </div>
                  </div>

                  {/* 2. TEMPERATURE */}
                  <div className="ocean-card-subtle p-3 space-y-1 hover:border-[#0789F9]/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#547392]">Temp (°C)</span>
                      <span className="status-pip status-pip-safe" />
                    </div>
                    <div className="text-xl font-bold font-mono text-[#12365F]">
                      {telemetry.liveTemp.toFixed(1)} <span className="text-xs font-sans font-normal text-slate-500">°C</span>
                    </div>
                    <div className="text-[10px] font-medium text-emerald-700">
                      Safe: 26.0 – 32.0°C
                    </div>
                  </div>

                  {/* 3. pH LEVEL */}
                  <div className="ocean-card-subtle p-3 space-y-1 hover:border-[#0789F9]/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#547392]">pH Level</span>
                      <span className="status-pip status-pip-safe" />
                    </div>
                    <div className="text-xl font-bold font-mono text-[#12365F]">
                      7.8 <span className="text-xs font-sans font-normal text-slate-500">pH</span>
                    </div>
                    <div className="text-[10px] font-medium text-emerald-700">
                      Safe: 6.5 – 8.5
                    </div>
                  </div>

                  {/* 4. SALINITY */}
                  <div className="ocean-card-subtle p-3 space-y-1 hover:border-[#0789F9]/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#547392]">Salinity</span>
                      <span className="status-pip status-pip-safe" />
                    </div>
                    <div className="text-xl font-bold font-mono text-[#12365F]">
                      1.2 <span className="text-xs font-normal">ppt</span>
                    </div>
                    <div className="text-[10px] font-medium text-emerald-700">
                      Safe: 0.5 – 3.0 ppt
                    </div>
                  </div>
                </div>

                {/* SENSOR FOOTNOTE */}
                <div className="pt-2 border-t border-[#e2eef9] flex items-center justify-between text-[10px] text-[#547392]">
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Optical Sensor Probe: Online</span>
                  </div>
                  <span className="text-slate-400">Turbidity: {telemetry.turbidityNtu} NTU</span>
                </div>
              </div>
            </div>

            {/* G. WATER QUALITY TREND CHART */}
            <WaterQualityTrendChart />
          </div>

          {/* RIGHT COLUMN: OPERATIONAL & HARDWARE PANELS (4 cols) */}
          <div className="col-span-4 space-y-6">
            {/* TODAY'S FEEDING SESSIONS SCHEDULE & LOG CARD (DESKTOP) */}
            <div className="ocean-card p-5 space-y-3.5 border-2 border-[#0789F9]/20">
              <div className="flex items-center justify-between pb-2 border-b border-[#e2eef9]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#0789F9]/10 text-[#0789F9] flex items-center justify-center">
                    <Utensils className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#12365F] text-sm">
                      Today's Feeding Schedule
                    </h3>
                    <span className="text-[10px] text-[#547392]">
                      {meals.length} Scheduled Daily Sessions
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
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                        isPending
                          ? 'border-[#0789F9]/40 bg-[#f8fbfe] hover:bg-[#f0f7fe] cursor-pointer shadow-2xs'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-xs text-[#0789F9]">
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

              <div className="pt-2 border-t border-[#e2eef9] flex items-center justify-between text-xs text-[#547392]">
                <span>Total Planned Today:</span>
                <span className="font-mono font-bold text-[#12365F]">
                  {meals.reduce((acc, m) => acc + m.plannedKg, 0).toFixed(1)} kg
                </span>
              </div>
            </div>

            {/* H1. DEVICE STATUS PANEL */}
            <div className="ocean-card p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#e2eef9]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#0789F9]/10 text-[#0789F9] flex items-center justify-center">
                    <Cpu className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#12365F] text-sm">
                      Device Status
                    </h3>
                    <span className="text-[10px] text-[#547392]">
                      Edge Controller Hardware
                    </span>
                  </div>
                </div>

                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Bus
                </span>
              </div>

              <div className="space-y-3">
                {/* ESP32 Controller connection */}
                <div className="p-3 rounded-xl bg-[#f0f7fe] border border-[#d6e8f7] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-[#12365F]">ESP32-S3 Gateway</div>
                    <div className="text-[10px] text-slate-500 font-mono">Signal: -64 dBm · WiFi Station</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                    Connected
                  </span>
                </div>

                {/* Water Quality Sensors status */}
                <div className="p-3 rounded-xl bg-[#f0f7fe] border border-[#d6e8f7] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-[#12365F]">Water Quality Sensors</div>
                    <div className="text-[10px] text-slate-500 font-mono">Modbus RS485 · Address 0x01</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                    Calibrated
                  </span>
                </div>

                {/* Automatic Corrective Equipment status */}
                <div className="p-3 rounded-xl bg-[#f0f7fe] border border-[#d6e8f7] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-[#12365F]">Aerator Relay Board</div>
                    <div className="text-[10px] text-slate-500 font-mono">2× Paddlewheels · Auto Mode</div>
                  </div>
                  <span className="text-[10px] font-bold text-teal-800 bg-white px-2 py-0.5 rounded border border-teal-200 flex items-center gap-1">
                    <Wind className="w-3 h-3 text-[#0789F9]" />
                    Standby
                  </span>
                </div>
              </div>
            </div>

            {/* H2. ALERTS & FEED INVENTORY PANEL */}
            <div className="ocean-card p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#e2eef9]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#0789F9]/10 text-[#0789F9] flex items-center justify-center">
                    <Package className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#12365F] text-sm">
                      Alerts & Feed Inventory
                    </h3>
                    <span className="text-[10px] text-[#547392]">
                      Stock reserves & meal cadence
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToTab?.('inventory')}
                  className="text-xs font-semibold text-[#0789F9] hover:underline"
                >
                  View All
                </button>
              </div>

              {/* Inventory items preview */}
              <div className="space-y-2.5">
                {inventory.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-[#e2eef9] bg-white flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#12365F]">{item.codeName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({item.pelletSizeMm}mm)</span>
                        {item.isShortStock && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded">
                            LOW
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#547392] mt-0.5">
                        Stock: <strong className="font-mono text-[#12365F]">{item.stockOnHandKg} kg</strong>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs font-bold font-mono block ${
                          item.daysLeft < 3 ? 'text-amber-600' : 'text-[#0789F9]'
                        }`}
                      >
                        {item.daysLeft.toFixed(1)} days
                      </span>
                      <span className="text-[10px] text-slate-400">Remaining</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AT THE END: SLID DOWN POND OVERVIEW & HERO SECTION */}
        <div className="pt-4 border-t border-[#e2eef9]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-[#0789F9]">
              Pond Ecosystem & Biological Growth Baseline
            </span>
            <span className="text-xs text-[#547392]">
              Overview & Environmental Parameters
            </span>
          </div>

          <HeroSection
            onViewPondDetails={() => onNavigateToTab?.('water')}
            onOpenTimetable={() => setShowTimetable(true)}
          />
        </div>
      </div>

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
