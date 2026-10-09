// src/components/WhyAmountModal.tsx
import React from 'react';
import {
  X,
  Calculator,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { aquacultureService } from '../services/aquacultureService';
import { DISCLAIMER_NOTE } from '../data';

interface WhyAmountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhyAmountModal: React.FC<WhyAmountModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const farmSetup = aquacultureService.getFarmSetup();
  const deadFish = aquacultureService.getDeadFishToday();
  const effectiveCount = Math.max(0, farmSetup.stockCount - deadFish);
  const stage = aquacultureService.getCalculatedStage();
  const rateLookup = aquacultureService.getRateLookup();
  const biomassKg = aquacultureService.getBiomassKg();
  const baseRationKg = Number(((biomassKg * rateLookup.ratePct) / 100.0).toFixed(1));
  const meals = aquacultureService.getMeals();
  const totalPlannedKg = meals.reduce((acc, m) => acc + m.plannedKg, 0).toFixed(1);
  const telemetry = aquacultureService.getTelemetry();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl border border-slate-300 flex flex-col justify-between max-h-[90vh]">
        {/* HEADER */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-[#f8faf9]">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#0f766e]" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Feed Calculation & Safety Ceiling Audit
              </h3>
              <span className="text-[10px] font-mono text-slate-500">
                Mathematical Verification for {farmSetup.pondName}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs font-mono">
          {/* STEP 1 */}
          <div className="bg-[#f8faf9] p-3.5 rounded border border-slate-200 space-y-1.5">
            <div className="flex justify-between font-bold text-slate-900 font-sans">
              <span>Step 1: Pond Population & Mean Weight</span>
              <span className="text-teal-700 font-mono text-[11px]">{stage.name}</span>
            </div>
            <p className="text-slate-600 font-sans leading-relaxed">
              Stocked count of <strong className="font-mono text-slate-900">{farmSetup.stockCount.toLocaleString()}</strong> minus{' '}
              <strong className="font-mono text-rose-700">{deadFish}</strong> recorded mortality ={' '}
              <strong className="font-mono text-slate-900">{effectiveCount.toLocaleString()} live fish</strong>.
              Current assessed weight is <strong className="font-mono text-slate-900">{farmSetup.currentWeightG}g/fish</strong>.
            </p>
          </div>

          {/* STEP 2 */}
          <div className="bg-[#f8faf9] p-3.5 rounded border border-slate-200 space-y-1.5">
            <div className="flex justify-between font-bold text-slate-900 font-sans">
              <span>Step 2: Live Biomass Equation</span>
              <span className="font-bold text-slate-900">{biomassKg} kg</span>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200 text-center font-bold text-slate-800">
              Biomass = {effectiveCount.toLocaleString()} fish × {farmSetup.currentWeightG}g ÷ 1,000 = {biomassKg} kg
            </div>
          </div>

          {/* STEP 3 */}
          <div className="bg-[#f8faf9] p-3.5 rounded border border-slate-200 space-y-2">
            <div className="flex justify-between font-bold text-slate-900 font-sans">
              <span>Step 3: Reference Table Feed Rate Lookup</span>
              <span className="font-bold text-teal-800">{rateLookup.ratePct}% / day</span>
            </div>
            <p className="text-slate-600 font-sans leading-relaxed">
              At {farmSetup.currentWeightG}g mean weight in water temp {telemetry.liveTemp.toFixed(1)}°C, the feeding table prescribes{' '}
              <strong>{rateLookup.ratePct}% of live biomass</strong> per day.
            </p>
            <div
              className={`p-2.5 rounded border text-[11px] flex items-center gap-2 ${
                rateLookup.isPlaceholder
                  ? 'bg-amber-50 text-amber-950 border-amber-300'
                  : 'bg-emerald-50 text-emerald-950 border-emerald-300'
              }`}
            >
              {rateLookup.isPlaceholder ? (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <div>
                <span className="font-bold block">
                  Table ID: {rateLookup.tableId} · {rateLookup.statusLabel}
                </span>
                <span className="text-[10px] text-slate-600 block">
                  Source: {rateLookup.sourceCitation}
                </span>
              </div>
            </div>
          </div>

          {/* STEP 4 */}
          <div className="bg-teal-50/70 p-3.5 rounded border border-teal-200 space-y-2">
            <span className="font-bold text-teal-950 block font-sans">
              Step 4: Hard Rule Safety Ceiling & Final Portion
            </span>
            <div className="space-y-1 text-slate-700">
              <div className="flex justify-between">
                <span>Base Scientific Ration ({biomassKg} kg × {rateLookup.ratePct}%):</span>
                <strong className="text-slate-900">{baseRationKg} kg</strong>
              </div>
              <div className="flex justify-between">
                <span>Hard Rule Safety Ceiling:</span>
                <strong className="text-teal-900">Max {baseRationKg} kg (Clamp)</strong>
              </div>
              <div className="flex justify-between font-bold border-t border-teal-200 pt-1 text-teal-950">
                <span>Total Planned Today across {meals.length} meals:</span>
                <span>{totalPlannedKg} kg</span>
              </div>
              <p className="text-[11px] text-teal-800 pt-1 font-sans">
                *Advisory rules (temperature, oxygen, tray feedback) are strictly restricted: they may only scale down or hold the ration, never exceed the feeding table baseline.
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-slate-200 bg-[#f8faf9] flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400">
            {DISCLAIMER_NOTE}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-medium"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
