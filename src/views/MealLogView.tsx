// src/views/MealLogView.tsx
import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  ChevronDown,
  XCircle,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { aquacultureService } from '../services/aquacultureService';
import { DISCLAIMER_NOTE, PLACEHOLDER_LIMITS } from '../data';

interface MealLogViewProps {
  activeMealId?: string;
  onNavigateToTab?: (tab: string) => void;
}

export const MealLogView: React.FC<MealLogViewProps> = ({ activeMealId }) => {
  const meals = aquacultureService.getMeals();
  const telemetry = aquacultureService.getTelemetry();
  const farmSetup = aquacultureService.getFarmSetup();
  const leftoverFeedback = aquacultureService.getLeftoverFeedback();

  const [selectedMealId, setSelectedMealId] = useState<string>(() => {
    if (activeMealId) return activeMealId;
    const pending = meals.find((m) => m.status === 'Pending');
    return pending ? pending.id : meals[0]?.id || 'session_1';
  });

  const [loggedStatusMessage, setLoggedStatusMessage] = useState<string | null>(null);

  const targetMeal = meals.find((m) => m.id === selectedMealId) || meals[0];

  const doValue = telemetry.liveDO;
  const isSafeDO = doValue >= PLACEHOLDER_LIMITS.oxygen.fullFeedingLevelMgL; // >= 5.0
  const isReducedDO =
    doValue >= PLACEHOLDER_LIMITS.oxygen.stopLevelMgL &&
    doValue < PLACEHOLDER_LIMITS.oxygen.fullFeedingLevelMgL; // 3.0 to 5.0
  const isStopDO = doValue < PLACEHOLDER_LIMITS.oxygen.stopLevelMgL; // < 3.0

  const plannedKg = targetMeal ? targetMeal.plannedKg : 10.0;
  const scaledKg = isReducedDO
    ? Number((plannedKg * 0.70).toFixed(1))
    : isStopDO
    ? 0.0
    : plannedKg;

  const handleLogGiven = (status: 'Given' | 'Reduced') => {
    if (!targetMeal) return;
    aquacultureService.logMealFed(targetMeal.id, scaledKg, status);
    setLoggedStatusMessage(`Logged ${scaledKg} kg as ${status.toLowerCase()} for ${targetMeal.time}`);
  };

  const handleSkipMeal = () => {
    if (!targetMeal) return;
    aquacultureService.skipMeal(
      targetMeal.id,
      `Safety Stop: Probe DO ${doValue.toFixed(1)} mg/L is below 3.0 mg/L threshold.`
    );
    setLoggedStatusMessage(`Meal skipped due to critical low oxygen (< 3.0 mg/L)`);
  };

  const handleRetryLater = () => {
    if (!targetMeal) return;
    aquacultureService.retryLaterReschedule(targetMeal.id);
    setLoggedStatusMessage(`Rescheduled ${targetMeal.time} meal to 03:30 PM safe daylight window.`);
  };

  const handleLeftoverSelect = (val: 'Fully eaten' | 'Some left' | 'Lots left') => {
    aquacultureService.setLeftoverFeedback(val);
  };

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-semibold">
            Pre-Meal Verification Interlock
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Dissolved Oxygen Gate & Session Log
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Pond: {farmSetup.pondName} · Optical DO Sensor Channel 0
          </p>
        </div>

        {/* SESSION SELECTOR */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-mono text-slate-500">Session:</label>
          <div className="relative">
            <select
              value={selectedMealId}
              onChange={(e) => {
                setSelectedMealId(e.target.value);
                setLoggedStatusMessage(null);
              }}
              className="appearance-none bg-white border border-slate-300 text-slate-900 text-xs font-mono font-semibold rounded px-3 py-1.5 pr-8 focus:outline-none focus:border-teal-600"
            >
              {meals.map((m) => (
                <option key={m.id} value={m.id}>
                  Meal {m.sessionIndex} ({m.time}) · {m.status} · {m.plannedKg}kg
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
          </div>
        </div>
      </div>

      {/* 2-COLUMN WIDESCREEN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: THE OXYGEN GATE INSTRUMENT PANEL (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* HARDWARE INTERLOCK CONSOLE */}
          <div className="surface-panel overflow-hidden border border-slate-300 shadow-2xs">
            {/* CONSOLE HEADER */}
            <div className="bg-[#0f2847] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-sky-500/20 text-sky-300 flex items-center justify-center border border-sky-400/30">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-sky-200">
                    Mandatory Pre-Meal Oxygen Gate
                  </h3>
                  <span className="text-[11px] text-sky-300 font-mono">
                    Target Session: {targetMeal?.time} ({targetMeal?.feedCode})
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-900/80 text-sky-200 border border-sky-700">
                Safe Threshold: ≥ 5.0 mg/L
              </span>
            </div>

            {/* SENSOR STREAM READOUT */}
            <div className="p-6 bg-white space-y-5">
              <div className="bg-[#f8faf9] border border-slate-200 rounded p-4 text-center">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                  Probe Dissolved Oxygen (DO) Telemetry
                </span>
                <div className="flex items-baseline justify-center gap-2 my-1">
                  <span className="text-5xl font-bold font-mono text-slate-900 tracking-tight">
                    {doValue.toFixed(1)}
                  </span>
                  <span className="text-xl font-mono text-sky-700 font-semibold">
                    mg/L
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-500 flex items-center justify-center gap-2">
                  <span>Sensor: Luminescent Optical DO (RS485)</span>
                  <span>·</span>
                  <span className="text-teal-700 font-medium">Sync: {telemetry.lastSyncText}</span>
                </div>
              </div>

              {/* THREE INTERLOCK STATES */}
              <div className="space-y-4">
                {/* STATE 1: SAFE (DO >= 5.0) */}
                {isSafeDO && (
                  <div className="border border-emerald-300 bg-emerald-50/70 rounded p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-xs text-emerald-950 uppercase font-mono">
                          Safety Interlock Cleared · Oxygen Normal
                        </h4>
                        <p className="text-xs text-emerald-900 mt-0.5 leading-relaxed">
                          Pond dissolved oxygen is at {doValue.toFixed(1)} mg/L (target ≥ 5.0 mg/L).
                          Fish respiration supports full digestive metabolic load. Full calculated portion is authorized.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleLogGiven('Given')}
                      className="w-full bg-[#0f766e] hover:bg-[#115e59] text-white font-semibold text-xs py-2.5 px-4 rounded shadow-2xs transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Log Full Ration Dispensed: {plannedKg} kg</span>
                    </button>
                  </div>
                )}

                {/* STATE 2: REDUCED (3.0 <= DO < 5.0) */}
                {isReducedDO && (
                  <div className="border border-amber-300 bg-amber-50/70 rounded p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-xs text-amber-950 uppercase font-mono">
                          Caution Interlock Active · Reduced Meal (-30%)
                        </h4>
                        <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
                          Pond DO is between 3.0 and 5.0 mg/L ({doValue.toFixed(1)} mg/L). Automated safety logic scales portion down by 30% to prevent post-prandial oxygen collapse.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/80 p-2.5 rounded border border-amber-200 text-xs font-mono flex justify-between">
                      <span>Baseline Planned: {plannedKg} kg</span>
                      <span className="font-bold text-amber-900">Scaled Allowance: {scaledKg} kg</span>
                    </div>

                    <button
                      onClick={() => handleLogGiven('Reduced')}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs py-2.5 px-4 rounded shadow-2xs transition-colors flex items-center justify-center gap-2"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>Log Scaled Ration Dispensed: {scaledKg} kg</span>
                    </button>
                  </div>
                )}

                {/* STATE 3: STOP (DO < 3.0) */}
                {isStopDO && (
                  <div className="border border-rose-300 bg-rose-50/80 rounded p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-xs text-rose-950 uppercase font-mono">
                          Mandatory Safety Interlock Engaged · STOP DO NOT FEED
                        </h4>
                        <p className="text-xs text-rose-900 mt-0.5 leading-relaxed">
                          Pond DO is critically low ({doValue.toFixed(1)} mg/L &lt; 3.0 mg/L threshold).
                          Digesting feed requires up to 40% additional oxygen; feeding now will induce severe stress or mortality.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={handleSkipMeal}
                        className="w-full bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs py-2.5 px-4 rounded shadow-2xs transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Skip Meal (Mandatory Stop)</span>
                      </button>

                      <button
                        onClick={handleRetryLater}
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs py-2.5 px-4 rounded shadow-2xs transition-colors flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Reschedule to 15:30 Window</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* AUDIT NOTICE */}
                {loggedStatusMessage && (
                  <div className="p-2.5 bg-slate-100 border border-slate-300 rounded text-center text-xs font-mono text-slate-800">
                    Audit Entry Saved: {loggedStatusMessage}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TRAY CLEARANCE FEEDBACK */}
          <div className="surface-panel p-5 space-y-3 shadow-2xs">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Feeding Tray Clearance (Appetite Observation)
              </h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Was yesterday's distributed feed fully eaten from checking trays?
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['Fully eaten', 'Some left', 'Lots left'] as const).map((opt) => {
                const isSelected = leftoverFeedback === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleLeftoverSelect(opt)}
                    className={`py-2 px-3 rounded text-xs font-medium border text-center transition-colors ${
                      isSelected
                        ? 'bg-[#0f766e] text-white border-[#0f766e] font-semibold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SESSION CHECKLIST & ADAPTIVE MODEL PREVIEW (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* TODAY'S SESSION AUDIT CHECKLIST */}
          <div className="surface-panel p-5 space-y-3 shadow-2xs">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Today's Meal Log Checklist
              </h3>
              <span className="text-[10px] font-mono text-slate-500">
                {meals.filter((m) => m.status === 'Given' || m.status === 'Reduced').length} of {meals.length} Fed
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {meals.map((m) => {
                const isSelected = m.id === selectedMealId;
                const isG = m.status === 'Given';
                const isS = m.status === 'Skipped';
                const isR = m.status === 'Reduced';

                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMealId(m.id)}
                    className={`p-3 rounded border flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-[#0f766e] bg-teal-50/40'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900 font-sans flex items-center gap-2">
                        <span>Meal {m.sessionIndex}</span>
                        <span className="font-mono text-xs text-slate-500 font-normal">({m.time})</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {m.feedCode} · Planned: {m.plannedKg} kg
                      </div>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium border ${
                        isG
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : isS
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : isR
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TOMORROW'S RATION ADAPTATION PREVIEW */}
          <div className="surface-panel p-5 space-y-3 shadow-2xs">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Tomorrow's Adaptive Adjustment
              </h3>
              <span className="text-[10px] font-mono text-teal-800">
                Feedback Loop Preview
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-sans">
              {leftoverFeedback === 'Lots left'
                ? 'Based on significant leftover feed reported on checking trays, tomorrow\'s baseline ration will be automatically reduced by -20% to avoid unconsumed feed rot and ammonia toxicity.'
                : leftoverFeedback === 'Some left'
                ? 'Minor leftovers noted. Tomorrow\'s ration will automatically scale down by -10% until trays clear consistently.'
                : leftoverFeedback === 'Fully eaten'
                ? 'Feed was 100% consumed. Baseline ration remains fully aligned with reference table. Eligible for +5% growth increment after 3 consecutive clean days.'
                : 'Select tray observation status to preview tomorrow\'s calibrated ration.'}
            </p>

            <div className="bg-[#f8faf9] p-2.5 rounded border border-slate-200 text-[11px] font-mono text-slate-600">
              Hard Ceiling Protection: Regardless of positive feedback, app rules prevent exceeding reference table 100% ceiling.
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
