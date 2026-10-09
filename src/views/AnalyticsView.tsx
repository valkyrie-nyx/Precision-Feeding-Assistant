// src/views/AnalyticsView.tsx
import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Fish,
  Scale,
  TrendingUp,
} from 'lucide-react';
import { aquacultureService } from '../services/aquacultureService';
import { DISCLAIMER_NOTE, PLACEHOLDER_LIMITS } from '../data';

export const AnalyticsView: React.FC = () => {
  const farmSetup = aquacultureService.getFarmSetup();
  const stage = aquacultureService.getCalculatedStage();
  const daysProjection = aquacultureService.getDaysToNextStage();
  const telemetry = aquacultureService.getTelemetry();

  const deadFishCount = aquacultureService.getDeadFishToday();
  const deadFishKg = aquacultureService.getDeadFishKgToday();
  const mortalityHistory = aquacultureService.getMortalityHistory();

  // Segmented toggle for mortality display: "Fish count" | "Weight (kg)"
  const [mortalityUnit, setMortalityUnit] = useState<'count' | 'kg'>('count');

  const [weighInput, setWeighInput] = useState<string>('44.5');
  const [successNote, setSuccessNote] = useState<string | null>(null);

  const [growthHistory, setGrowthHistory] = useState([
    { date: '2026-09-24', weightG: 34.0, fcr: 1.28, stage: 'Fingerling' },
    { date: '2026-10-01', weightG: 37.5, fcr: 1.31, stage: 'Fingerling' },
    { date: '2026-10-08', weightG: 40.0, fcr: 1.34, stage: 'Fingerling' },
  ]);

  const handleLogWeigh = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(weighInput);
    if (isNaN(val) || val <= 0) return;

    const today = new Date().toISOString().split('T')[0];
    setGrowthHistory((prev) => [
      { date: today, weightG: val, fcr: 1.32, stage: stage.name },
      ...prev,
    ]);

    // Recalibrate in service
    farmSetup.currentWeightG = val;
    aquacultureService.refreshCalculations();

    setSuccessNote(`Sample recorded: ${val}g mean weight logged. Pond biomass, growth stage, and feed rations recalibrated.`);
    setTimeout(() => setSuccessNote(null), 4000);
  };

  const highLossThresholdCount = farmSetup.stockCount * (PLACEHOLDER_LIMITS.mortality.dailyHighLossThresholdPct / 100.0);
  const isHighMortalityToday = deadFishCount > highLossThresholdCount;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#dcebfa] pb-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#0789F9] bg-[#f0f7fe] px-2.5 py-0.5 rounded-full border border-[#d6e8f7]">
            Biological Growth & Mortality Tracking
          </span>
          <h2 className="text-2xl font-extrabold text-[#12365F] tracking-tight mt-1">
            Growth Analytics & Population Audit
          </h2>
          <p className="text-xs text-[#547392] mt-0.5">
            Pond: {farmSetup.pondName} · FAO Bioenergetics & Thermal Growth Coefficient (TGC)
          </p>
        </div>

        <div className="text-xs font-medium text-[#12365F] bg-white px-3.5 py-2 rounded-2xl border border-[#dcebfa] shadow-xs flex items-center gap-2">
          <span className="status-pip status-pip-caution" />
          <span>TGC Model: {PLACEHOLDER_LIMITS.tgc.badgeText}</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. MORTALITY ANALYTICS PANEL WITH COUNT / KG TOGGLE            */}
      {/* ============================================================== */}
      <section className="ocean-card p-6 border border-[#dcebfa] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e2eef9]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#0789F9]/10 text-[#0789F9] flex items-center justify-center">
              <Fish className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-bold text-[#12365F] text-base">
                Daily Mortality & Population Deduction
              </h3>
              <p className="text-xs text-[#547392]">
                Audit daily losses in count or biomass to safeguard pond carrying capacity
              </p>
            </div>
          </div>

          {/* SEGMENTED TOGGLE: Fish count | Weight (kg) */}
          <div className="inline-flex p-1 rounded-xl bg-[#f0f7fe] border border-[#d6e8f7] shadow-2xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setMortalityUnit('count')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                mortalityUnit === 'count'
                  ? 'bg-[#0789F9] text-white shadow-xs'
                  : 'text-[#547392] hover:text-[#12365F]'
              }`}
            >
              <Fish className="w-3.5 h-3.5" />
              <span>Fish count</span>
            </button>

            <button
              type="button"
              onClick={() => setMortalityUnit('kg')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                mortalityUnit === 'kg'
                  ? 'bg-[#0789F9] text-white shadow-xs'
                  : 'text-[#547392] hover:text-[#12365F]'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Weight (kg)</span>
            </button>
          </div>
        </div>

        {/* HIGH LOSS WARNING BANNER (NEVER RED!) */}
        {isHighMortalityToday && (
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-950 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5 text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                {PLACEHOLDER_LIMITS.mortality.alertMessage}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 border border-amber-300">
                {PLACEHOLDER_LIMITS.mortality.badgeText}
              </span>
            </div>
            <p className="text-xs text-amber-800">
              Today's recorded loss is {deadFishCount} fish ({deadFishKg.toFixed(2)} kg), which exceeds the 0.5% threshold ({highLossThresholdCount.toFixed(0)} fish). Inspect oxygen levels and feeding trays.
            </p>
          </div>
        )}

        {/* METRICS ROW: BOTH COUNT AND KG SHOWN */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Today's Mortality Metric */}
          <div className="bg-[#f8fbfe] p-4 rounded-2xl border border-[#d6e8f7]">
            <span className="text-[10px] font-bold text-[#547392] uppercase tracking-wider block">
              Today's Mortality
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#12365F] font-mono">
                {mortalityUnit === 'count' ? deadFishCount : deadFishKg.toFixed(2)}
              </span>
              <span className="text-xs font-bold text-[#547392]">
                {mortalityUnit === 'count' ? 'fish' : 'kg'}
              </span>
            </div>
            <span className="text-xs text-[#087A91] font-medium block mt-1">
              {mortalityUnit === 'count'
                ? `approx. ${deadFishKg.toFixed(2)} kg at ${farmSetup.currentWeightG} g average`
                : `approx. ${deadFishCount} fish at ${farmSetup.currentWeightG} g average`}
            </span>
          </div>

          {/* Active Live Population */}
          <div className="bg-[#f8fbfe] p-4 rounded-2xl border border-[#d6e8f7]">
            <span className="text-[10px] font-bold text-[#547392] uppercase tracking-wider block">
              Active Population
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#0789F9] font-mono">
                {Math.max(0, farmSetup.stockCount - deadFishCount).toLocaleString()}
              </span>
              <span className="text-xs font-bold text-[#547392]">fish</span>
            </div>
            <span className="text-xs text-slate-500 font-medium block mt-1">
              Original stocking: {farmSetup.stockCount.toLocaleString()}
            </span>
          </div>

          {/* Active Live Biomass */}
          <div className="bg-[#f8fbfe] p-4 rounded-2xl border border-[#d6e8f7]">
            <span className="text-[10px] font-bold text-[#547392] uppercase tracking-wider block">
              Remaining Biomass
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-700 font-mono">
                {aquacultureService.getBiomassKg()}
              </span>
              <span className="text-xs font-bold text-[#547392]">kg</span>
            </div>
            <span className="text-xs text-slate-500 font-medium block mt-1">
              Deduction: {deadFishKg.toFixed(2)} kg today
            </span>
          </div>
        </div>

        {/* MORTALITY AUDIT LOG TABLE */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#12365F]">
            Mortality Deduction Audit Log
          </h4>
          <div className="overflow-x-auto rounded-2xl border border-[#e2eef9]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f0f7fe] text-[#547392] text-[10px] font-bold uppercase tracking-wider border-b border-[#e2eef9]">
                <tr>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">
                    {mortalityUnit === 'count' ? 'Count (Entered)' : 'Count (Estimated)'}
                  </th>
                  <th className="py-2.5 px-4">
                    {mortalityUnit === 'kg' ? 'Weight (Entered)' : 'Weight (Estimated)'}
                  </th>
                  <th className="py-2.5 px-4">Remaining Population</th>
                  <th className="py-2.5 px-4 text-right">Remaining Biomass</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f6fb] bg-white font-mono">
                {mortalityHistory.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#f8fbfe] transition-colors">
                    <td className="py-2.5 px-4 font-sans font-bold text-[#12365F]">
                      {item.date}
                    </td>
                    <td className="py-2.5 px-4 text-[#12365F]">
                      {item.count} fish
                    </td>
                    <td className="py-2.5 px-4 text-[#087A91] font-semibold">
                      {item.kg.toFixed(2)} kg
                    </td>
                    <td className="py-2.5 px-4 text-[#547392]">
                      {item.remainingCount.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-emerald-700">
                      {item.remainingBiomassKg} kg
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. BIOLOGICAL GROWTH COEFFICIENTS & TGC METRICS                 */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Mean Body Weight */}
        <div className="ocean-card p-5 space-y-1 border border-[#dcebfa]">
          <div className="flex items-center justify-between text-[10px] font-bold text-[#547392] uppercase">
            <span>Mean Body Weight</span>
            <span className="text-[#0789F9] font-bold bg-[#f0f7fe] px-2 py-0.5 rounded-full border border-[#d6e8f7]">
              {stage.name}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-3xl font-extrabold font-mono text-[#12365F]">
              {farmSetup.currentWeightG}
            </span>
            <span className="text-xs text-[#547392] font-semibold">grams / fish</span>
          </div>
          <span className="text-[11px] text-[#547392] block">
            Next stage bracket: {stage.weightMaxG ? `${stage.weightMaxG}g` : 'Market harvest size'}
          </span>
        </div>

        {/* Days to Next Stage Projection */}
        <div className="ocean-card p-5 space-y-1 border border-[#dcebfa]">
          <div className="flex items-center justify-between text-[10px] font-bold text-[#547392] uppercase">
            <span>Next Stage Transition</span>
            <span className="text-[#547392] font-mono text-[10px]">TGC 1.0</span>
          </div>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-3xl font-extrabold font-mono text-[#12365F]">
              {daysProjection.daysRangeText}
            </span>
          </div>
          <span className="text-[11px] text-[#547392] block">
            Water temp: {telemetry.liveTemp.toFixed(1)}°C driving growth rate
          </span>
        </div>

        {/* Feed Conversion Ratio */}
        <div className="ocean-card p-5 space-y-1 border border-[#dcebfa]">
          <div className="flex items-center justify-between text-[10px] font-bold text-[#547392] uppercase">
            <span>Cumulative FCR</span>
            <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ON TARGET
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-3xl font-extrabold font-mono text-[#12365F]">
              1.32
            </span>
            <span className="text-xs text-[#547392] font-semibold">kg feed / kg gain</span>
          </div>
          <span className="text-[11px] text-[#547392] block">
            Expected reference FCR: {PLACEHOLDER_LIMITS.fcr.expectedValue}
          </span>
        </div>
      </div>

      {/* 2-COLUMN GRID: CALIBRATION & FORMULA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: WEEKLY SAMPLE WEIGHING LOG FORM (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="ocean-card p-6 space-y-4 border border-[#dcebfa]">
            <div className="border-b border-[#e2eef9] pb-3">
              <h3 className="text-sm font-bold text-[#12365F]">
                Weekly Sampling Calibration Form
              </h3>
              <p className="text-xs text-[#547392] mt-0.5">
                Physical net scoop sampling recalibrates pond biomass and growth stage
              </p>
            </div>

            {successNote && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{successNote}</span>
              </div>
            )}

            <form onSubmit={handleLogWeigh} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#12365F] uppercase">
                  Measured Mean Weight of 30-Fish Sample (grams)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={weighInput}
                    onChange={(e) => setWeighInput(e.target.value)}
                    className="w-full bg-[#f8fbfe] border border-[#d6e8f7] focus:border-[#0789F9] rounded-2xl px-4 py-2.5 text-xl font-mono font-bold text-[#12365F] focus:outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#547392]">
                    grams
                  </span>
                </div>
                <p className="text-xs text-[#547392]">
                  Submitting will automatically re-index the FAO feeding table, adjust daily ration, and calibrate the TGC slope.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0789F9] hover:bg-[#0574d6] text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md shadow-[#0789F9]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Record Weighing & Recalibrate Model</span>
              </button>
            </form>
          </div>

          {/* HISTORICAL WEIGHINGS TABLE */}
          <div className="ocean-card p-6 space-y-3 border border-[#dcebfa]">
            <div className="border-b border-[#e2eef9] pb-2.5 flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#12365F]">
                Sample Weighing Verification Log
              </h4>
              <span className="text-xs text-[#547392]">{farmSetup.pondName} History</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#e2eef9] text-[10px] uppercase text-[#547392] font-sans font-bold">
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Mean Weight</th>
                    <th className="pb-2">Assessed Stage</th>
                    <th className="pb-2 text-right">Sample FCR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f6fb]">
                  {growthHistory.map((rec, idx) => (
                    <tr key={idx} className="hover:bg-[#f8fbfe] transition-colors">
                      <td className="py-2.5 text-[#547392]">{rec.date}</td>
                      <td className="py-2.5 font-bold text-[#12365F]">{rec.weightG} g</td>
                      <td className="py-2.5 text-[#12365F] font-sans">{rec.stage}</td>
                      <td className="py-2.5 text-right font-bold text-emerald-700">{rec.fcr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT: TGC SCIENTIFIC FORMULA EXPLANATION (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="ocean-card p-6 space-y-4 border border-[#dcebfa]">
            <div className="border-b border-[#e2eef9] pb-3">
              <h3 className="text-sm font-bold text-[#12365F]">
                Scientific Growth Equation: TGC Formulation
              </h3>
              <p className="text-xs text-[#547392] mt-0.5">
                Thermal Growth Coefficient Growth Model
              </p>
            </div>

            <div className="bg-[#f0f7fe] p-4 rounded-2xl border border-[#d6e8f7] font-mono text-center space-y-1">
              <span className="text-xs text-[#547392] uppercase block font-sans font-bold">
                Core Growth Formula
              </span>
              <div className="text-sm font-bold text-[#12365F] py-1">
                W_next^(1/3) = W_today^(1/3) + (TGC × Temperature) / 1000
              </div>
              <div className="text-[11px] text-[#547392]">
                Days to Stage = 1000 × (Target^(1/3) - Current^(1/3)) ÷ (TGC × Temp)
              </div>
            </div>

            <div className="space-y-3 text-xs text-[#547392] leading-relaxed">
              <p>
                Unlike terrestrial livestock, fish and shrimp growth rates depend strictly on water temperature (T).
                Metabolism doubles approximately every 10°C within optimal thermal bounds (27–32°C).
              </p>
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-950 text-xs space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Model Calibration Caveat:
                </span>
                <p className="text-[11px] text-amber-800">
                  TGC = 1.0 is an illustrative baseline. True TGC varies by feed protein %, dissolved oxygen saturation, and strain genetics. Weekly sampling recalibrates this coefficient to the exact pond condition.
                </p>
              </div>
            </div>
          </div>

          {/* FCR EFFICIENCY METRICS */}
          <div className="ocean-card p-6 space-y-3 border border-[#dcebfa]">
            <div className="border-b border-[#e2eef9] pb-2.5 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#0789F9]" />
              <h4 className="text-sm font-bold text-[#12365F]">
                Feed Conversion Ratio (FCR) Economic Analysis
              </h4>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between font-mono pb-1 border-b border-[#f0f6fb]">
                <span className="text-[#547392] font-sans">Cumulative Feed Distributed:</span>
                <strong className="text-[#12365F]">415.8 kg</strong>
              </div>
              <div className="flex justify-between font-mono pb-1 border-b border-[#f0f6fb]">
                <span className="text-[#547392] font-sans">Net Estimated Biomass Gain:</span>
                <strong className="text-[#12365F]">315.0 kg</strong>
              </div>
              <div className="flex justify-between font-mono pb-1 border-b border-[#f0f6fb]">
                <span className="text-[#547392] font-sans">Calculated Feed Conversion:</span>
                <strong className="text-emerald-700">1.32 (FCR)</strong>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-[#547392] font-sans">Feed Cost per kg Harvest:</span>
                <strong className="text-[#12365F]">~₹92.40 / kg fish</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="pt-6 pb-2 text-center border-t border-[#dcebfa]">
        <p className="text-[11px] uppercase tracking-wider text-[#547392]">
          {DISCLAIMER_NOTE}
        </p>
      </footer>
    </div>
  );
};
