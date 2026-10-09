// src/components/CheckinModal.tsx
import React, { useState } from 'react';
import {
  Plus,
  Minus,
  CalendarCheck,
  X,
  Radio,
  Fish,
  Scale,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { aquacultureService } from '../services/aquacultureService';
import { DISCLAIMER_NOTE, PLACEHOLDER_LIMITS } from '../data';

interface CheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanCreated?: () => void;
}

export const CheckinModal: React.FC<CheckinModalProps> = ({
  isOpen,
  onClose,
  onPlanCreated,
}) => {
  const farmSetup = aquacultureService.getFarmSetup();
  const telemetry = aquacultureService.getTelemetry();
  const initialDeadCount = aquacultureService.getDeadFishToday();
  const initialDeadKg = aquacultureService.getDeadFishKgToday();
  const initialUnit = aquacultureService.getMortalityInputUnit();

  const avgWeightG = farmSetup.currentWeightG || 40.0;
  const avgWeightKg = avgWeightG / 1000.0;
  const totalStock = farmSetup.stockCount || 15000;
  const totalBiomassKg = (totalStock * avgWeightG) / 1000.0;

  // Segmented toggle mode: 'count' | 'kg' (Default is Fish count)
  const [unitMode, setUnitMode] = useState<'count' | 'kg'>(initialUnit || 'count');
  const [countInput, setCountInput] = useState<number>(initialDeadCount || 0);
  const [kgInput, setKgInput] = useState<number>(
    initialDeadKg > 0 ? initialDeadKg : Number((initialDeadCount * avgWeightKg).toFixed(2))
  );
  const [confirmationMsg, setConfirmationMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Sync helpers
  const handleCountChange = (newCount: number) => {
    const validCount = Math.max(0, newCount);
    setCountInput(validCount);
    const estKg = Number((validCount * avgWeightKg).toFixed(2));
    setKgInput(estKg);
  };

  const handleKgChange = (newKg: number) => {
    const validKg = Math.max(0, Number(newKg.toFixed(2)));
    setKgInput(validKg);
    const estCount = Math.round(validKg / avgWeightKg);
    setCountInput(estCount);
  };

  // Synchronized values
  const currentCount = unitMode === 'count' ? countInput : Math.round(kgInput / avgWeightKg);
  const currentKg = unitMode === 'kg' ? kgInput : Number((countInput * avgWeightKg).toFixed(2));

  // Read-only estimate strings (Always labeled "approx.")
  const kgEstimateText = `approx. ${currentKg.toFixed(2)} kg at ${avgWeightG} g average`;
  const countEstimateText = `approx. ${currentCount.toLocaleString()} fish at ${avgWeightG} g average`;

  // Validation: block values above population or biomass
  const isCountExceeded = currentCount > totalStock;
  const isKgExceeded = currentKg > totalBiomassKg;
  const hasValidationError = isCountExceeded || isKgExceeded;

  let validationMessage = '';
  if (isCountExceeded) {
    validationMessage = `Entered count (${currentCount.toLocaleString()} fish) exceeds total pond population of ${totalStock.toLocaleString()} fish.`;
  } else if (isKgExceeded) {
    validationMessage = `Entered weight (${currentKg.toFixed(2)} kg) exceeds total pond biomass of ${totalBiomassKg.toFixed(1)} kg.`;
  }

  // High-loss warning: if one day's loss > 0.5% of population (from data.ts)
  const highLossThresholdCount = totalStock * (PLACEHOLDER_LIMITS.mortality.dailyHighLossThresholdPct / 100.0);
  const isHighLoss = currentCount > highLossThresholdCount;

  // Live remaining calculations
  const remainingCount = Math.max(0, totalStock - currentCount);
  const remainingBiomassKg = ((remainingCount * avgWeightG) / 1000.0).toFixed(1);

  const handleMakePlan = () => {
    if (hasValidationError) return;

    const confirmation = aquacultureService.finishCheckin({
      count: currentCount,
      kg: currentKg,
      unit: unitMode,
    });

    setConfirmationMsg(confirmation);

    setTimeout(() => {
      if (onPlanCreated) onPlanCreated();
      onClose();
      setConfirmationMsg(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col justify-between max-h-[92vh] overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
              <CalendarCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                Daily Morning Pond Check-in
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                Pond: {farmSetup.pondName} · Population & Mortality Deduction
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* CONFIRMATION BANNER (AFTER SAVE) */}
          {confirmationMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 text-xs font-semibold flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{confirmationMsg}</span>
            </div>
          )}

          {/* DEAD FISH LOG CARD */}
          <div className="bg-[#f8faf9] border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                <Fish className="w-4 h-4 text-teal-700" />
                Dead Fish Observed Today
              </span>

              {/* SEGMENTED TOGGLE: Fish count | Weight (kg) */}
              <div className="inline-flex p-1 rounded-lg bg-white border border-slate-300 shadow-2xs self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setUnitMode('count')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    unitMode === 'count'
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Fish className="w-3.5 h-3.5" />
                  <span>Fish count</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUnitMode('kg')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    unitMode === 'kg'
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Weight (kg)</span>
                </button>
              </div>
            </div>

            {/* INPUT SECTION ACCORDING TO UNIT MODE */}
            {unitMode === 'count' ? (
              /* --- FISH COUNT MODE --- */
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-6 py-2">
                  <button
                    type="button"
                    onClick={() => handleCountChange(countInput - 1)}
                    disabled={countInput <= 0}
                    className="w-12 h-12 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center shadow-xs font-mono font-bold text-lg transition-colors cursor-pointer"
                    aria-label="Decrease fish count"
                  >
                    <Minus className="w-5 h-5" />
                  </button>

                  <div className="min-w-[120px] text-center">
                    <span className="text-4xl sm:text-5xl font-extrabold font-mono text-slate-900">
                      {countInput}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mt-0.5">
                      fish count
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCountChange(countInput + 1)}
                    className="w-12 h-12 rounded-xl bg-teal-700 hover:bg-teal-800 text-white flex items-center justify-center shadow-xs font-mono font-bold text-lg transition-colors cursor-pointer"
                    aria-label="Increase fish count"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* READ-ONLY ESTIMATE IN COUNT MODE */}
                <div className="text-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-teal-800">
                    {kgEstimateText}
                  </span>
                </div>
              </div>
            ) : (
              /* --- WEIGHT (KG) MODE --- */
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-4 py-2">
                  <button
                    type="button"
                    onClick={() => handleKgChange(Math.max(0, kgInput - 0.1))}
                    disabled={kgInput <= 0}
                    className="w-12 h-12 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center shadow-xs font-mono font-bold text-lg transition-colors cursor-pointer"
                    aria-label="Decrease weight"
                  >
                    <Minus className="w-5 h-5" />
                  </button>

                  <div className="relative flex items-center justify-center">
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      min="0"
                      value={kgInput}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        handleKgChange(isNaN(val) ? 0 : val);
                      }}
                      className="w-36 text-center text-4xl sm:text-5xl font-extrabold font-mono text-slate-900 bg-white border-2 border-teal-600/40 rounded-xl py-1 px-2 focus:outline-none focus:border-teal-700 shadow-inner"
                      placeholder="0.0"
                    />
                    <span className="ml-2 font-bold text-base text-slate-600">kg</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleKgChange(kgInput + 0.1)}
                    className="w-12 h-12 rounded-xl bg-teal-700 hover:bg-teal-800 text-white flex items-center justify-center shadow-xs font-mono font-bold text-lg transition-colors cursor-pointer"
                    aria-label="Increase weight"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* READ-ONLY ESTIMATE IN WEIGHT MODE */}
                <div className="text-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-teal-800">
                    {countEstimateText}
                  </span>
                </div>
              </div>
            )}

            {/* VALIDATION ERROR (BLOCKS VALUES ABOVE TOTAL POPULATION / BIOMASS) */}
            {hasValidationError && (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{validationMessage}</span>
              </div>
            )}

            {/* HIGH-LOSS WARNING: AMBER ALERT (NEVER RED!) */}
            {isHighLoss && !hasValidationError && (
              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-950 space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{PLACEHOLDER_LIMITS.mortality.alertMessage}</span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 border border-amber-300">
                    {PLACEHOLDER_LIMITS.mortality.badgeText}
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed font-sans">
                  Observed loss of {currentCount.toLocaleString()} fish ({currentKg.toFixed(2)} kg) exceeds the 0.5% threshold ({highLossThresholdCount.toFixed(0)} fish). Check oxygen levels and examine fish health.
                </p>
              </div>
            )}

            {/* LIVE ACTIVE BIOMASS DISPLAY */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium font-mono">Live Active Biomass:</span>
              <span className="font-extrabold text-slate-900 font-mono">
                {remainingBiomassKg} kg ({remainingCount.toLocaleString()} fish remaining)
              </span>
            </div>
          </div>

          {/* TELEMETRY AUTO STRIP */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-700 font-bold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-teal-700" />
                Automated Environmental Stream
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 uppercase font-bold">
                ESP32 Auto
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-xs font-mono">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Condition</span>
                <span className="font-bold text-slate-800 block truncate mt-0.5">
                  {telemetry.weatherCondition.split('&')[0]}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Probe DO</span>
                <span className="font-extrabold font-mono text-teal-800 block mt-0.5">
                  {telemetry.liveDO.toFixed(1)} mg/L
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Water Temp</span>
                <span className="font-extrabold font-mono text-slate-900 block mt-0.5">
                  {telemetry.liveTemp.toFixed(1)}°C
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-slate-200 bg-[#f8faf9] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[10px] font-mono text-slate-400 max-w-xs text-center sm:text-left">
            {DISCLAIMER_NOTE}
          </span>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-mono font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleMakePlan}
              disabled={hasValidationError}
              className="flex-1 sm:flex-initial px-5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-mono font-bold shadow-xs transition-all cursor-pointer"
            >
              Apply Check-in & Recalibrate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
