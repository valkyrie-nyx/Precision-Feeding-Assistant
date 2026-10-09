// src/views/AnalyticsView.tsx
import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { aquacultureService } from '../services/aquacultureService';
import { DISCLAIMER_NOTE, PLACEHOLDER_LIMITS } from '../data';

export const AnalyticsView: React.FC = () => {
  const farmSetup = aquacultureService.getFarmSetup();
  const stage = aquacultureService.getCalculatedStage();
  const daysProjection = aquacultureService.getDaysToNextStage();
  const telemetry = aquacultureService.getTelemetry();

  const [weighInput, setWeighInput] = useState<string>('44.5');
  const [successNote, setSuccessNote] = useState<string | null>(null);

  const [history, setHistory] = useState([
    { date: '2026-09-24', weightG: 34.0, fcr: 1.28, stage: 'Fingerling' },
    { date: '2026-10-01', weightG: 37.5, fcr: 1.31, stage: 'Fingerling' },
    { date: '2026-10-08', weightG: 40.0, fcr: 1.34, stage: 'Fingerling' },
  ]);

  const handleLogWeigh = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(weighInput);
    if (isNaN(val) || val <= 0) return;

    const today = new Date().toISOString().split('T')[0];
    setHistory((prev) => [
      { date: today, weightG: val, fcr: 1.32, stage: stage.name },
      ...prev,
    ]);

    // Recalibrate in service
    farmSetup.currentWeightG = val;
    aquacultureService.refreshCalculations();

    setSuccessNote(`Sample recorded: ${val}g mean weight logged. Pond biomass, growth stage, and feed rations recalibrated.`);
    setTimeout(() => setSuccessNote(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-semibold">
            Biological Modeling
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Thermal Growth Coefficient (TGC) & FCR Analytics
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Pond: {farmSetup.pondName} · Weight-driven Stage Modeling
          </p>
        </div>

        <div className="text-xs font-mono text-slate-600 bg-white px-3 py-1.5 rounded border border-slate-200 flex items-center gap-2">
          <span className="status-pip status-pip-caution" />
          <span>TGC Model Status: {PLACEHOLDER_LIMITS.tgc.badgeText}</span>
        </div>
      </div>

      {/* METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Mean Body Weight */}
        <div className="surface-panel p-4 space-y-1 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase">
            <span>Mean Body Weight</span>
            <span className="text-teal-800 font-bold bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
              {stage.name}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono text-slate-900">
              {farmSetup.currentWeightG}
            </span>
            <span className="text-xs font-mono text-slate-500">grams/fish</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono block">
            Next stage bracket: {stage.weightMaxG ? `${stage.weightMaxG}g` : 'Market harvest size'}
          </span>
        </div>

        {/* Days to Next Stage Projection */}
        <div className="surface-panel p-4 space-y-1 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase">
            <span>Next Stage Transition</span>
            <span className="text-slate-600 font-mono">TGC 1.0</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono text-slate-900">
              {daysProjection.daysRangeText}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono block">
            Water temp: {telemetry.liveTemp.toFixed(1)}°C driving growth rate
          </span>
        </div>

        {/* Feed Conversion Ratio */}
        <div className="surface-panel p-4 space-y-1 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase">
            <span>Cumulative FCR</span>
            <span className="text-emerald-700 font-bold font-mono">ON TARGET</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono text-slate-900">
              1.32
            </span>
            <span className="text-xs font-mono text-slate-500">kg feed / kg gain</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono block">
            Expected reference FCR: {PLACEHOLDER_LIMITS.fcr.expectedValue}
          </span>
        </div>
      </div>

      {/* 2-COLUMN GRID: CALIBRATION & FORMULA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: WEEKLY SAMPLE WEIGHING LOG FORM (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="surface-panel p-5 space-y-4 shadow-2xs">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Weekly Sampling Calibration Form
              </h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Physical net scoop sampling recalibrates pond biomass and growth stage
              </p>
            </div>

            {successNote && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono rounded flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{successNote}</span>
              </div>
            )}

            <form onSubmit={handleLogWeigh} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-700 uppercase">
                  Measured Mean Weight of 30-Fish Sample (grams)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={weighInput}
                    onChange={(e) => setWeighInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#0f766e] rounded px-3 py-2 text-xl font-mono font-bold text-slate-900 focus:outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">
                    grams
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Submitting will automatically re-index the FAO feeding table, adjust daily ration, and calibrate the TGC slope.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0f766e] hover:bg-[#115e59] text-white font-mono text-xs font-semibold py-2.5 px-4 rounded shadow-2xs transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Record Weighing & Recalibrate Model</span>
              </button>
            </form>
          </div>

          {/* HISTORICAL WEIGHINGS TABLE */}
          <div className="surface-panel p-5 space-y-3 shadow-2xs">
            <div className="border-b border-slate-200 pb-2.5 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Sample Weighing Verification Log
              </h4>
              <span className="text-[10px] font-mono text-slate-500">Pond A1 History</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] uppercase text-slate-500">
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Mean Weight</th>
                    <th className="pb-2">Assessed Stage</th>
                    <th className="pb-2 text-right">Sample FCR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((rec, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 text-slate-600">{rec.date}</td>
                      <td className="py-2.5 font-bold text-slate-900">{rec.weightG} g</td>
                      <td className="py-2.5 text-slate-700 font-sans">{rec.stage}</td>
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
          <div className="surface-panel p-5 space-y-4 shadow-2xs">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Scientific Growth Equation: TGC Formulation
              </h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Thermal Growth Coefficient Growth Model
              </p>
            </div>

            <div className="bg-[#f8faf9] p-4 rounded border border-slate-200 font-mono text-center space-y-1">
              <span className="text-xs text-slate-500 uppercase block font-sans font-semibold">
                Core Growth Formula
              </span>
              <div className="text-sm font-bold text-slate-900 py-1">
                W_next^(1/3) = W_today^(1/3) + (TGC × Temperature) / 1000
              </div>
              <div className="text-[11px] text-slate-500">
                Days to Stage = 1000 × (Target^(1/3) - Current^(1/3)) ÷ (TGC × Temp)
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700 leading-relaxed font-sans">
              <p>
                Unlike terrestrial livestock, fish and shrimp growth rates depend strictly on water temperature (T).
                Metabolism doubles approximately every 10°C within optimal thermal bounds (27–32°C).
              </p>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-950 text-xs space-y-1 font-mono">
                <span className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Model Calibration Caveat:
                </span>
                <p className="font-sans text-[11px]">
                  TGC = 1.0 is an illustrative baseline. True TGC varies by feed protein %, dissolved oxygen saturation, and strain genetics. Weekly sampling recalibrates this coefficient to the exact pond condition.
                </p>
              </div>
            </div>
          </div>

          {/* FCR EFFICIENCY METRICS */}
          <div className="surface-panel p-5 space-y-3 shadow-2xs">
            <div className="border-b border-slate-200 pb-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Feed Conversion Ratio (FCR) Economic Analysis
              </h4>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-mono pb-1 border-b border-slate-100">
                <span className="text-slate-500">Cumulative Feed Distributed:</span>
                <strong className="text-slate-900">415.8 kg</strong>
              </div>
              <div className="flex justify-between font-mono pb-1 border-b border-slate-100">
                <span className="text-slate-500">Net Estimated Biomass Gain:</span>
                <strong className="text-slate-900">315.0 kg</strong>
              </div>
              <div className="flex justify-between font-mono pb-1 border-b border-slate-100">
                <span className="text-slate-500">Calculated Feed Conversion:</span>
                <strong className="text-emerald-700">1.32 (FCR)</strong>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-500">Feed Cost per kg Harvest:</span>
                <strong className="text-slate-900">~₹92.40 / kg fish</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="pt-6 pb-2 text-center border-t border-slate-200/80">
        <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
          {DISCLAIMER_NOTE}
        </p>
      </footer>
    </div>
  );
};
