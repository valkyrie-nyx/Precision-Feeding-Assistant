// src/components/CheckinModal.tsx
import React, { useState } from 'react';
import {
  Plus,
  Minus,
  CalendarCheck,
  X,
  Radio,
  Fish,
} from 'lucide-react';
import { aquacultureService } from '../services/aquacultureService';
import { DISCLAIMER_NOTE } from '../data';

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
  const initialDead = aquacultureService.getDeadFishToday();

  const [deadFish, setDeadFish] = useState<number>(initialDead);

  if (!isOpen) return null;

  const effectiveCount = Math.max(0, farmSetup.stockCount - deadFish);
  const updatedBiomassKg = ((effectiveCount * farmSetup.currentWeightG) / 1000.0).toFixed(1);

  const handleIncrement = () => setDeadFish((prev) => prev + 1);
  const handleDecrement = () => setDeadFish((prev) => Math.max(0, prev - 1));

  const handleMakePlan = () => {
    aquacultureService.finishCheckin(deadFish);
    if (onPlanCreated) onPlanCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-slate-300 flex flex-col justify-between max-h-[90vh]">
        {/* HEADER */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-[#f8faf9]">
          <div className="flex items-center gap-2.5">
            <CalendarCheck className="w-4 h-4 text-[#0f766e]" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Daily Morning Pond Check-in
              </h3>
              <span className="text-[10px] font-mono text-slate-500">
                Pond: {farmSetup.pondName} · Population & Environment Audit
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
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* DEAD FISH LOG */}
          <div className="bg-[#f8faf9] border border-slate-200 rounded p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 font-mono">
                <Fish className="w-3.5 h-3.5 text-slate-500" />
                Dead Fish Observed Today
              </span>
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                Mortality Deduction
              </span>
            </div>

            <div className="flex items-center justify-center gap-6 py-1">
              <button
                onClick={handleDecrement}
                disabled={deadFish <= 0}
                className="w-10 h-10 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center shadow-2xs font-mono font-bold"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="min-w-[100px] text-center">
                <span className="text-4xl font-bold font-mono text-slate-900">
                  {deadFish}
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase block">
                  fish count
                </span>
              </div>

              <button
                onClick={handleIncrement}
                className="w-10 h-10 rounded bg-[#0f766e] hover:bg-[#115e59] text-white flex items-center justify-center shadow-2xs font-mono font-bold"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white p-2.5 rounded border border-slate-200 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Live Active Biomass:</span>
              <span className="font-bold text-slate-900">
                {updatedBiomassKg} kg ({effectiveCount.toLocaleString()} fish)
              </span>
            </div>
          </div>

          {/* TELEMETRY AUTO STRIP */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-600 font-bold flex items-center gap-1">
                <Radio className="w-3 h-3 text-[#0f766e]" />
                Automated Environmental Stream
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-teal-50 text-teal-800 border border-teal-200 uppercase">
                ESP32 Auto
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase block">Condition</span>
                <span className="font-bold text-slate-800 block truncate">
                  {telemetry.weatherCondition.split('&')[0]}
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase block">Probe DO</span>
                <span className="font-bold text-slate-900 block">
                  {telemetry.liveDO.toFixed(1)} mg/L
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase block">Water Temp</span>
                <span className="font-bold text-slate-900 block">
                  {telemetry.liveTemp.toFixed(1)}°C
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-slate-200 bg-[#f8faf9] flex items-center justify-between gap-3">
          <span className="text-[10px] font-mono text-slate-400">
            {DISCLAIMER_NOTE}
          </span>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-mono font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleMakePlan}
              className="px-4 py-1.5 rounded bg-[#0f766e] hover:bg-[#115e59] text-white text-xs font-mono font-semibold shadow-2xs"
            >
              Apply Check-in & Recalibrate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
