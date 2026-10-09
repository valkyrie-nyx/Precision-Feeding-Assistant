// src/components/FullTimetableModal.tsx
import React, { useState } from 'react';
import {
  Clock,
  X,
  HelpCircle,
  Droplets,
} from 'lucide-react';
import { aquacultureService } from '../services/aquacultureService';
import { DISCLAIMER_NOTE } from '../data';

interface FullTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMealForFeeding?: (meal: any) => void;
}

export const FullTimetableModal: React.FC<FullTimetableModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [expandedWhyMealId, setExpandedWhyMealId] = useState<string | null>(null);

  if (!isOpen) return null;

  const meals = aquacultureService.getMeals();
  const farmSetup = aquacultureService.getFarmSetup();
  const totalPlannedKg = meals.reduce((acc, m) => acc + m.plannedKg, 0).toFixed(1);

  const toggleWhy = (mealId: string) => {
    setExpandedWhyMealId((prev) => (prev === mealId ? null : mealId));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl border border-slate-300 flex flex-col justify-between max-h-[90vh]">
        {/* HEADER */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-[#f8faf9]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#0f766e]" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Dynamic Feeding Timetable Audit
              </h3>
              <span className="text-[10px] font-mono text-slate-500">
                Pond: {farmSetup.pondName} · Diurnal Dissolved Oxygen Coordination
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

        {/* SUMMARY STATS */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-mono">
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Total Daily Ration</span>
            <span className="font-bold text-slate-900">{totalPlannedKg} kg</span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 text-[10px] uppercase block">Assigned Sessions</span>
            <span className="font-bold text-slate-900">{meals.length} Meals Today</span>
          </div>
        </div>

        {/* LIST */}
        <div className="p-5 space-y-3 overflow-y-auto max-h-[60vh]">
          {meals.map((meal) => {
            const isGiven = meal.status === 'Given';
            const isSkipped = meal.status === 'Skipped';
            const isReduced = meal.status === 'Reduced';
            const isExpanded = expandedWhyMealId === meal.id;

            return (
              <div
                key={meal.id}
                className="p-3.5 rounded border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">
                        Meal {meal.sessionIndex}
                      </span>
                      <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                        {meal.time}
                      </span>
                      {meal.isRescheduled && (
                        <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                          Rescheduled
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-mono text-slate-600 mt-1">
                      <span>Planned: <strong>{meal.plannedKg} kg</strong></span>
                      <span className="mx-2">·</span>
                      <span>{meal.feedCode} ({meal.pelletSizeMm}mm)</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium border ${
                        isGiven
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : isSkipped
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : isReduced
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {meal.status}
                    </span>

                    <button
                      onClick={() => toggleWhy(meal.id)}
                      className="text-[11px] font-mono text-[#0f766e] hover:underline flex items-center gap-1"
                    >
                      <HelpCircle className="w-3 h-3" />
                      <span>{isExpanded ? 'Hide reason' : 'Why this time?'}</span>
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-2 pt-2 border-t border-slate-100 text-xs font-mono bg-slate-50 p-2.5 rounded text-slate-700 space-y-1">
                    <div className="font-bold text-slate-800 flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5 text-sky-600" />
                      <span>Diurnal Oxygen Rationale:</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                      {meal.whyThisTime}
                    </p>
                    <div className="text-[10px] text-slate-500">
                      Predicted Probe DO: <strong>{meal.predictedDO.toFixed(1)} mg/L</strong>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
            Close Timetable
          </button>
        </div>
      </div>
    </div>
  );
};
