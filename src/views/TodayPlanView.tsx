// src/views/TodayPlanView.tsx
import React, { useState } from 'react';
import {
  AlertTriangle,
  HelpCircle,
  Droplets,
  ShieldCheck,
  ChevronRight,
  Cpu,
  Radio,
  Package,
  Clock,
  Sparkles,
  X,
  Wind,
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
      {/* 1. HERO SECTION (AIRY WHITE, WAVE BLOBS, SWIMMING FISH, POND OVERVIEW) */}
      <HeroSection
        onViewPondDetails={() => onNavigateToTab?.('water')}
        onOpenTimetable={() => setShowTimetable(true)}
      />

      {/* 2. SAFETY ALERT (HORIZONTAL PALE-AMBER BANNER WITH ORANGE WARNING ICON) */}
      {shortBatch && !dismissedAlerts.includes('stock-banner') && (
        <div className="relative bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-4 sm:p-5 text-[#92400E] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
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

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
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

      {/* 3. MAIN WORKSPACE GRID: FEEDING & WATER QUALITY (LEFT) + OPERATIONAL PANELS (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: FEEDING RECOMMENDATION + WATER QUALITY + TREND CHART (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* TOP ROW: FEEDING RECOMMENDATION PANEL & WATER QUALITY SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* E. FEEDING RECOMMENDATION PANEL (MD: 5 cols) */}
            <div className="md:col-span-6 ocean-card p-5 space-y-4 flex flex-col justify-between">
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
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#0789F9] hover:bg-[#0574d6] text-white text-xs font-bold shadow-md shadow-[#0789F9]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                  <span>Start Feeding Session</span>
                </button>

                <button
                  onClick={() => setShowWhyAmount(true)}
                  className="py-2.5 px-3 rounded-xl bg-[#f0f7fe] hover:bg-[#e4f1fc] text-[#0789F9] text-xs font-semibold border border-[#d6e8f7] transition-colors"
                  title="Mathematical explanation of feed quantity"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* F. WATER QUALITY SECTION (MD: 7 cols) */}
            <div className="md:col-span-6 ocean-card p-5 space-y-3 flex flex-col justify-between">
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
                    1.2 <span className="text-xs font-sans font-normal text-slate-500">ppt</span>
                  </div>
                  <div className="text-[10px] font-medium text-emerald-700">
                    Safe: 0.5 – 3.0 ppt
                  </div>
                </div>
              </div>

              {/* SENSOR FOOTNOTE */}
              <div className="pt-2 border-t border-[#e2eef9] flex items-center justify-between text-[10px] text-[#547392]">
                <div className="flex items-center gap-1.5 font-mono">
                  <Radio className="w-3 h-3 text-[#0789F9] animate-pulse" />
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
        <div className="lg:col-span-4 space-y-6">
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

            {/* NEXT SCHEDULED FEEDING SUMMARY */}
            <div className="pt-3 border-t border-[#e2eef9] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0789F9]" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Next Session</span>
                  <span className="font-bold text-[#12365F]">
                    {nextMeal ? nextMeal.time : '08:30 AM'} · {totalPlannedKg} kg
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowTimetable(true)}
                className="px-3 py-1.5 rounded-lg bg-[#f0f7fe] hover:bg-[#e4f1fc] text-[#0789F9] font-bold text-xs transition-colors"
              >
                Schedule
              </button>
            </div>
          </div>
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
