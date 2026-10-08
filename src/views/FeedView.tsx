// src/views/FeedView.tsx
import React, { useState } from 'react';
import {
  CheckCircle2,
  Droplets,
  Check,
  CheckCheck,
  Sun,
  Calendar,
} from 'lucide-react';
import { aquacultureService } from '../services/aquacultureService';
import { DISCLAIMER_NOTE, type MealItem } from '../MockData';
import { OxygenGateModal } from '../components/OxygenGateModal';

export const FeedView: React.FC = () => {
  const meals = aquacultureService.getMeals();
  const checkinData = aquacultureService.getCheckinData();

  // Active oxygen check modal
  const [activeOxygenMeal, setActiveOxygenMeal] = useState<MealItem | null>(null);

  // Active Mark Fed modal
  const [activeFedMeal, setActiveFedMeal] = useState<{
    meal: MealItem;
    unlockedKg: number;
  } | null>(null);

  // Local state tracking which meals have passed oxygen gate
  const [unlockedMealIds, setUnlockedMealIds] = useState<Record<string, number>>({});

  // Feeding form inputs
  const [actualKgInput, setActualKgInput] = useState<string>('3.2');
  const [leftoverChoice, setLeftoverChoice] = useState<'none' | 'a little' | 'a lot'>('none');

  const allMealsCompleted = meals.every((m) => m.status === 'Given' || m.status === 'Skipped');
  const hasLeftover = meals.some((m) => m.leftover === 'a little' || m.leftover === 'a lot');

  const handleOpenOxygenCheck = (meal: MealItem) => {
    setActiveOxygenMeal(meal);
  };

  const handleUnlockMeal = (scaledRationKg: number) => {
    if (activeOxygenMeal) {
      setUnlockedMealIds((prev) => ({
        ...prev,
        [activeOxygenMeal.id]: scaledRationKg,
      }));
      setActiveFedMeal({ meal: activeOxygenMeal, unlockedKg: scaledRationKg });
      setActualKgInput(scaledRationKg.toString());
      setActiveOxygenMeal(null);
    }
  };

  const handleSkipMeal = (reason: string) => {
    if (activeOxygenMeal) {
      aquacultureService.recordMealSkipped(activeOxygenMeal.id, reason);
      setActiveOxygenMeal(null);
    }
  };

  const handleConfirmFed = () => {
    if (activeFedMeal) {
      const kg = parseFloat(actualKgInput) || activeFedMeal.unlockedKg;
      aquacultureService.recordMealFed(activeFedMeal.meal.id, kg, leftoverChoice);
      setActiveFedMeal(null);
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-md mx-auto">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Today's Feeding Checklist
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Oxygen check mandatory before unlocking each meal checkbox.
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-sky-100 text-sky-900 px-3 py-1 rounded-full border border-sky-300">
          DO: {checkinData.latestDO.toFixed(1)} mg/L
        </span>
      </div>

      {/* MEAL CHECKLIST */}
      <div className="space-y-4">
        {meals.map((meal, idx) => {
          const isUnlocked = unlockedMealIds[meal.id] !== undefined;
          const isDone = meal.status === 'Given';
          const isSkipped = meal.status === 'Skipped';

          return (
            <div
              key={meal.id}
              className={`p-5 rounded-3xl border-2 transition-all relative overflow-hidden shadow-md ${
                isDone
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                  : isSkipped
                  ? 'bg-rose-50 border-rose-400 text-rose-950'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {/* STAMP BADGE FOR COMPLETED MEALS */}
              {isDone && (
                <div className="absolute right-4 top-4 border-2 border-emerald-600 text-emerald-700 uppercase font-black text-sm px-3 py-1 rounded-xl rotate-12 bg-white/80 backdrop-blur-sm shadow-sm flex items-center gap-1">
                  <CheckCheck className="w-4 h-4 stroke-[3]" />
                  <span>DONE</span>
                </div>
              )}

              {isSkipped && (
                <div className="absolute right-4 top-4 border-2 border-rose-600 text-rose-700 uppercase font-black text-xs px-2.5 py-1 rounded-xl -rotate-6 bg-white/80 backdrop-blur-sm shadow-sm">
                  SKIPPED
                </div>
              )}

              <div className="space-y-3">
                {/* Session Header */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 uppercase">
                    Meal #{idx + 1} • {meal.time}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900">{meal.feedType}</h3>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">
                    Pellet Mix: {meal.pelletSizeMm} mm • Planned: {meal.plannedKg} kg
                  </p>
                </div>

                {/* STATUS & ACTIONS */}
                {!isDone && !isSkipped && (
                  <div className="pt-2 space-y-2">
                    {/* BLUE OXYGEN CHECK CARD (MUST BE DONE FIRST) */}
                    <div className="bg-sky-50 border-2 border-sky-300 p-3.5 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                          <Droplets className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-extrabold text-sky-950 uppercase tracking-wider block">
                            Oxygen Check
                          </span>
                          <span className="text-[11px] font-bold text-sky-800">
                            {isUnlocked ? 'Gate Passed: Oxygen OK' : 'Required before feeding'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenOxygenCheck(meal)}
                        className="bg-sky-600 hover:bg-sky-500 text-white font-black text-xs py-2 px-3 rounded-xl shadow active:scale-95 transition-all"
                      >
                        {isUnlocked ? 'Re-Check DO' : 'Check DO'}
                      </button>
                    </div>

                    {/* MEAL CHECKBOX / MARK FED BUTTON */}
                    <button
                      onClick={() => {
                        if (!isUnlocked) {
                          handleOpenOxygenCheck(meal);
                        } else {
                          setActiveFedMeal({
                            meal,
                            unlockedKg: unlockedMealIds[meal.id] || meal.plannedKg,
                          });
                          setActualKgInput((unlockedMealIds[meal.id] || meal.plannedKg).toString());
                        }
                      }}
                      className={`w-full py-3.5 px-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all ${
                        isUnlocked
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg active:scale-98'
                          : 'bg-slate-100 text-slate-400 border border-slate-300 cursor-pointer'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>{isUnlocked ? 'Tick "Fed" & Record Feed' : 'Checkbox Locked (DO Required)'}</span>
                    </button>
                  </div>
                )}

                {/* SUMMARY FOR DONE MEALS */}
                {isDone && (
                  <div className="pt-1 text-xs font-bold text-emerald-900 space-y-1">
                    <p>
                      Given: <strong>{meal.actualKg || meal.plannedKg} kg</strong> • Leftover:{' '}
                      <strong className="capitalize">{meal.leftover || 'none'}</strong>
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* AFTER LAST MEAL: TOMORROW'S ADJUSTMENT & DAY COMPLETE */}
      {allMealsCompleted && (
        <div className="space-y-4 animate-in zoom-in-95 duration-300 pt-2">
          {/* TOMORROW'S ADJUSTMENT CARD */}
          <div className="bg-teal-50 border-2 border-teal-500 p-5 rounded-3xl space-y-3 text-teal-950 shadow-md">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-6 h-6 text-teal-700 shrink-0" />
              <h3 className="text-lg font-black text-teal-950">Tomorrow's Ration Adjustment</h3>
            </div>

            <p className="text-xs font-bold text-teal-900 leading-relaxed bg-white p-3 rounded-2xl border border-teal-200">
              {hasLeftover
                ? "Tomorrow's ration: down 10% because of leftover noticed today. Stock updated."
                : "Tomorrow's ration: maintain full baseline ration. Stock updated."}
            </p>

            <div className="flex items-center justify-between text-xs font-extrabold text-teal-800">
              <span>Feed Stock Status:</span>
              <span className="bg-teal-200 text-teal-950 px-2.5 py-1 rounded-lg">Updated</span>
            </div>
          </div>

          {/* CALM DAY COMPLETE SCREEN */}
          <div className="bg-white border-2 border-slate-200 p-6 rounded-3xl text-center space-y-3 shadow-lg">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
              <Sun className="w-8 h-8 stroke-[2.5]" />
            </div>

            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Day Complete</h3>

            <p className="text-xs font-semibold text-slate-600 leading-relaxed max-w-xs mx-auto">
              All scheduled feeding sessions for today are done and recorded. Have a calm evening!
            </p>
          </div>
        </div>
      )}

      {/* OXYGEN GATE MODAL */}
      {activeOxygenMeal && (
        <OxygenGateModal
          meal={activeOxygenMeal}
          onClose={() => setActiveOxygenMeal(null)}
          onUnlockMeal={handleUnlockMeal}
          onSkipMeal={handleSkipMeal}
        />
      )}

      {/* MARK FED & LEFTOVER SHEET / MODAL */}
      {activeFedMeal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md p-6 rounded-3xl shadow-2xl space-y-4 border-2 border-emerald-400">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xl font-black text-slate-900">Record Feeding</h3>
                <p className="text-xs text-slate-500 font-bold">{activeFedMeal.meal.time} Meal</p>
              </div>
              <button
                onClick={() => setActiveFedMeal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* KG GIVEN INPUT */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block">
                  How many kg did you feed?
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={actualKgInput}
                    onChange={(e) => setActualKgInput(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-300 focus:border-emerald-600 rounded-2xl p-3 text-2xl font-black font-mono text-slate-900 text-center"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                    kg
                  </span>
                </div>
              </div>

              {/* LEFTOVER TILES */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block">
                  Was there any leftover feed?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['none', 'a little', 'a lot'] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setLeftoverChoice(opt)}
                      className={`py-3 px-2 rounded-2xl border-2 text-xs font-black capitalize transition-all ${
                        leftoverChoice === opt
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-md ring-2 ring-emerald-200'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CONFIRM BUTTON */}
            <button
              onClick={handleConfirmFed}
              className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-black text-lg rounded-2xl py-4 px-4 flex items-center justify-center gap-2 shadow-xl active:scale-98 transition-all"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>Confirm & Stamp "Done"</span>
            </button>
          </div>
        </div>
      )}

      {/* Mandatory Disclaimer */}
      <p className="text-[11px] text-center text-slate-400 font-semibold tracking-wide">
        {DISCLAIMER_NOTE}
      </p>
    </div>
  );
};
