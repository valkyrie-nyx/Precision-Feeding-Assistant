// src/components/OxygenGateModal.tsx
import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  X,
  RotateCcw,
  Droplets,
  Activity,
} from 'lucide-react';
import { aquacultureService } from '../services/aquacultureService';
import { DISCLAIMER_NOTE, type MealItem } from '../MockData';

interface OxygenGateModalProps {
  meal: MealItem;
  onClose: () => void;
  onUnlockMeal: (scaledRationKg: number) => void;
  onSkipMeal: (reason: string) => void;
}

export const OxygenGateModal: React.FC<OxygenGateModalProps> = ({
  meal,
  onClose,
  onUnlockMeal,
  onSkipMeal,
}) => {
  const checkinData = aquacultureService.getCheckinData();
  const [doInput, setDoInput] = useState<number>(checkinData.latestDO);
  
  const evaluation = aquacultureService.evaluateOxygen(doInput);

  const handleDoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val >= 0) {
      setDoInput(val);
    }
  };

  const scaledRationKg = Math.round(meal.plannedKg * evaluation.scaleFactor * 10) / 10;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl border-2 border-sky-300 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* OXYGEN CHECK CARD HEADER - ALWAYS BLUE */}
        <div className="bg-sky-600 px-5 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <Droplets className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-black text-lg tracking-tight uppercase text-white">
                Pre-Meal Oxygen Check
              </h3>
              <p className="text-xs text-sky-100 font-bold">
                {meal.time} • Mandatory Safety Check
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-5 overflow-y-auto space-y-5 bg-white text-slate-800">
          {/* SENSOR DO READOUT / OVERRIDE */}
          <div className="bg-sky-50 border-2 border-sky-200 p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-sky-600" />
                Current Dissolved Oxygen (DO)
              </label>
              <span className="text-xs font-extrabold text-sky-700">
                Target ≥ 5.0 mg/L
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="relative flex-1">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="15"
                  value={doInput}
                  onChange={handleDoChange}
                  className="w-full bg-white border-2 border-sky-400 focus:border-sky-600 rounded-2xl px-4 py-3 text-3xl font-black text-sky-950 text-center font-mono focus:outline-none shadow-inner"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-sky-700">
                  mg/L
                </span>
              </div>
            </div>
            <p className="text-[11px] text-sky-800 font-semibold text-center pt-1">
              Adjust DO slider/number above to test low or optimal oxygen conditions.
            </p>
          </div>

          {/* OXYGEN EVALUATION RESULTS */}

          {/* CASE 1: RED SKIP MEAL SCREEN (DO < 3.0 mg/L) */}
          {evaluation.status === 'Stop' && (
            <div className="bg-rose-50 border-2 border-rose-500 rounded-3xl p-5 text-rose-950 space-y-4 shadow-md animate-in zoom-in-95">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <ShieldAlert className="w-7 h-7 stroke-[2.5]" />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-md bg-rose-600 text-white font-black text-xs uppercase tracking-wider">
                    SAFETY STOP
                  </span>
                  <h4 className="font-black text-xl text-rose-950 mt-1">
                    SKIP MEAL REQUIRED
                  </h4>
                </div>
              </div>

              <p className="text-xs font-bold text-rose-900 leading-relaxed bg-white p-3 rounded-2xl border border-rose-200">
                {evaluation.description}
              </p>

              <div className="bg-rose-100 p-3 rounded-2xl border border-rose-300 text-xs font-bold text-rose-950">
                <span>Alert sent to farm manager. Feed checkbox remains locked.</span>
              </div>

              {/* SINGLE BUTTON: RETRY LATER */}
              <button
                onClick={() => {
                  onSkipMeal('Blocked: Oxygen below 3.0 mg/L safety stop threshold');
                }}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black text-lg rounded-2xl py-4 px-4 flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all"
              >
                <RotateCcw className="w-5 h-5 stroke-[2.5]" />
                <span>Retry Later</span>
              </button>
            </div>
          )}

          {/* CASE 2: AMBER REDUCED MEAL (3.0 - 5.0 mg/L) */}
          {evaluation.status === 'Reduced' && (
            <div className="bg-amber-50 border-2 border-amber-400 rounded-3xl p-5 text-amber-950 space-y-4 shadow-md animate-in zoom-in-95">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-amber-950 flex items-center justify-center shrink-0 shadow-md">
                  <AlertTriangle className="w-7 h-7 stroke-[2.5]" />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-amber-950 font-black text-xs uppercase tracking-wider">
                    REDUCED MEAL
                  </span>
                  <h4 className="font-black text-xl text-amber-950 mt-1">
                    Caution: Moderate Oxygen
                  </h4>
                </div>
              </div>

              <p className="text-xs font-bold text-amber-900 leading-relaxed bg-white p-3 rounded-2xl border border-amber-200">
                {evaluation.description}
              </p>

              <div className="bg-amber-100 p-3 rounded-2xl border border-amber-300 flex items-center justify-between text-xs font-bold text-amber-950">
                <span>Reduced Portion:</span>
                <span className="text-lg font-black text-amber-950 font-mono">
                  {scaledRationKg} kg (was {meal.plannedKg} kg)
                </span>
              </div>

              <button
                onClick={() => onUnlockMeal(scaledRationKg)}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black text-lg rounded-2xl py-4 px-4 flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Unlock Reduced Meal</span>
              </button>
            </div>
          )}

          {/* CASE 3: GREEN OXYGEN OK (≥ 5.0 mg/L) */}
          {evaluation.status === 'Safe' && (
            <div className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-5 text-emerald-950 space-y-4 shadow-md animate-in zoom-in-95">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-black text-xs uppercase tracking-wider">
                    OXYGEN OK
                  </span>
                  <h4 className="font-black text-xl text-emerald-950 mt-1">
                    Optimal Oxygen Level
                  </h4>
                </div>
              </div>

              <p className="text-xs font-bold text-emerald-900 leading-relaxed bg-white p-3 rounded-2xl border border-emerald-200">
                {evaluation.description}
              </p>

              <div className="bg-emerald-100 p-3 rounded-2xl border border-emerald-300 flex items-center justify-between text-xs font-bold text-emerald-950">
                <span>Approved Portion:</span>
                <span className="text-lg font-black text-emerald-950 font-mono">
                  {meal.plannedKg} kg
                </span>
              </div>

              <button
                onClick={() => onUnlockMeal(meal.plannedKg)}
                className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-black text-lg rounded-2xl py-4 px-4 flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Unlock Meal Checkbox</span>
              </button>
            </div>
          )}
        </div>

        {/* FOOTER DISCLAIMER */}
        <div className="px-5 pb-3">
          <p className="text-[10px] text-center text-slate-400 font-bold">
            {DISCLAIMER_NOTE}
          </p>
        </div>
      </div>
    </div>
  );
};
