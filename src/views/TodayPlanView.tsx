// src/views/TodayPlanView.tsx
import React, { useState } from 'react';
import {
  ArrowRight,
  Clock,
  Radio,
  AlertTriangle,
  HelpCircle,
  Check,
  CalendarCheck,
  ChevronRight,
} from 'lucide-react';
import { aquacultureService, type AppMealItem } from '../services/aquacultureService';
import { FullTimetableModal } from '../components/FullTimetableModal';
import { WhyAmountModal } from '../components/WhyAmountModal';
import { CheckinModal } from '../components/CheckinModal';
import { DISCLAIMER_NOTE } from '../data';

interface TodayPlanViewProps {
  onStartFeeding: (meal?: AppMealItem) => void;
}

export const TodayPlanView: React.FC<TodayPlanViewProps> = ({ onStartFeeding }) => {
  const farmSetup = aquacultureService.getFarmSetup();
  const nextMeal = aquacultureService.getNextMeal();
  const meals = aquacultureService.getMeals();
  const alerts = aquacultureService.getActiveAlerts().slice(0, 2); // At most 2 urgent alerts
  const adviceList = aquacultureService.getAdviceList();
  const isCheckedIn = aquacultureService.getIsCheckedInToday();

  const [showTimetable, setShowTimetable] = useState(false);
  const [showWhyAmount, setShowWhyAmount] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);

  const mealIndex = nextMeal ? nextMeal.sessionIndex : 1;
  const totalMeals = meals.length;

  return (
    <div className="space-y-6 pb-24 max-w-md mx-auto">
      {/* MORNING CHECK-IN STRIP / BUTTON */}
      <div className="flex items-center justify-between bg-slate-50 border border-slate-200/90 rounded-2xl px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center">
            <CalendarCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
              Daily Check-in
            </span>
            <span className="text-xs font-black text-slate-900 block">
              {isCheckedIn ? 'Checked in today' : 'Pending morning check-in'}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowCheckin(true)}
          className="bg-white hover:bg-slate-100 text-teal-800 text-xs font-black px-4 py-2 rounded-full border border-teal-300 shadow-sm transition-all touch-target"
        >
          {isCheckedIn ? 'Edit check-in' : 'Check in now'}
        </button>
      </div>

      {/* AT MOST 2 URGENT ALERTS ABOVE NEXT FEEDING CARD */}
      {alerts.length > 0 && (
        <div className="space-y-2.5 animate-in slide-in-from-top duration-200">
          {alerts.map((alt) => {
            const isCritical = alt.severity === 'critical';
            return (
              <div
                key={alt.id}
                className={`p-4 rounded-3xl border-2 flex items-start gap-3 shadow-md ${
                  isCritical
                    ? 'bg-rose-50 border-rose-500 text-rose-950'
                    : 'bg-amber-50 border-amber-500 text-amber-950'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isCritical ? 'bg-rose-600 text-white ring-offset-rose' : 'bg-amber-600 text-white ring-offset-amber'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider">
                      Urgent Safety Notice
                    </span>
                    <button
                      onClick={() => aquacultureService.dismissAlert(alt.id)}
                      className="text-[10px] font-bold text-slate-500 hover:text-slate-800"
                    >
                      Dismiss
                    </button>
                  </div>
                  <h4 className="text-xs font-black leading-snug">{alt.title}</h4>
                  <p className="text-[11px] font-medium leading-relaxed opacity-90">{alt.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* NEXT FEEDING FOCUS CARD (Outdoor Sunlight Visibility: >= 48px Text) */}
      {nextMeal ? (
        <div className="space-y-3">
          <div
            onClick={() => setShowTimetable(true)}
            role="button"
            tabIndex={0}
            className="group relative bg-white border-2 border-teal-500/80 rounded-[2.5rem] p-6 shadow-xl cursor-pointer hover:border-teal-600 transition-all overflow-hidden"
          >
            {/* Background organic wave decorative blob */}
            <div className="absolute -top-16 -right-16 w-44 h-44 bg-teal-50/70 blob-shape-1 pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-sky-50/70 blob-shape-2 pointer-events-none" />

            <div className="relative z-10 space-y-4">
              {/* TOP STRIP: POND NAME & MEAL NUMBER */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-700 block">
                    {farmSetup.farmName}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    {farmSetup.pondName}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="bg-teal-50 text-teal-800 text-xs font-black px-3 py-1.5 rounded-full border border-teal-200 block">
                    Meal {mealIndex} of {totalMeals}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 block mt-1">
                    Scheduled at {nextMeal.time}
                  </span>
                </div>
              </div>

              {/* HUGE TEXT >= 48px: KG TO GIVE */}
              <div className="py-2 text-center bg-slate-50/80 rounded-3xl border border-slate-200/80 p-4">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500 block">
                  Prescribed Portion
                </span>
                <div className="flex items-baseline justify-center gap-2 mt-1">
                  <span className="text-6xl font-black text-slate-950 tracking-tight font-mono">
                    {nextMeal.plannedKg}
                  </span>
                  <span className="text-2xl font-black text-teal-700 font-mono">
                    kg
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-600 mt-2">
                  {nextMeal.feedCode} · {nextMeal.pelletSizeMm} mm pellets
                </div>
              </div>

              {/* TIMETABLE MODAL TAP HINT */}
              <div className="flex items-center justify-between text-xs font-bold text-teal-800 pt-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-600" />
                  Tap card to view full timetable
                </span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* MAIN ACTION BUTTON: ONE BIG PILL PER SCREEN */}
          <button
            onClick={() => onStartFeeding(nextMeal)}
            className="w-full bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-black text-xl rounded-full py-4 px-6 flex items-center justify-center gap-3 shadow-xl active:scale-98 transition-all touch-target"
          >
            <span>Start feeding</span>
            <ArrowRight className="w-6 h-6 stroke-[3]" />
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-[2.5rem] p-6 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md ring-offset-emerald">
            <Check className="w-7 h-7 stroke-[3]" />
          </div>
          <h3 className="text-xl font-black text-emerald-950">
            All meals completed today!
          </h3>
          <p className="text-xs text-emerald-800 font-medium">
            Feed plan finished for {farmSetup.pondName}. Review logs or check tomorrow's schedule below.
          </p>
        </div>
      )}

      {/* WHY THIS AMOUNT? TAP LINK */}
      <div className="text-center">
        <button
          onClick={() => setShowWhyAmount(true)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50/80 hover:bg-teal-100/80 px-4 py-2 rounded-full border border-teal-200 transition-all touch-target"
        >
          <HelpCircle className="w-4 h-4 text-teal-600" />
          <span>Why this amount? (Calculation Breakdown)</span>
        </button>
      </div>

      {/* ADVICE CARDS SECTION */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-teal-600" />
            Decision Support Advice ({adviceList.length})
          </h4>
          <span className="text-[10px] font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            Hard Ceiling: Max 100%
          </span>
        </div>

        <div className="space-y-2.5">
          {adviceList.map((adv) => {
            const isAccepted = adv.farmerAction === 'Accepted';
            const isDismissed = adv.farmerAction === 'Dismissed';

            return (
              <div
                key={adv.id}
                className={`p-4 rounded-3xl border transition-all ${
                  isDismissed
                    ? 'opacity-40 bg-slate-50 border-slate-200'
                    : isAccepted
                    ? 'bg-teal-50/50 border-teal-300'
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 block">
                      {adv.category} recommendation
                    </span>
                    <h5 className="text-sm font-black text-slate-900 leading-snug">
                      {adv.title}
                    </h5>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {adv.suggestion}. <span className="text-slate-400">({adv.reason})</span>
                    </p>
                  </div>
                </div>

                {/* ACCEPT / DISMISS BUTTONS */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 mt-2">
                  {adv.farmerAction === 'Pending' ? (
                    <>
                      <button
                        onClick={() => aquacultureService.updateAdviceAction(adv.id, 'Dismissed')}
                        className="px-3 py-1.5 rounded-full text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition-all touch-target"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => aquacultureService.updateAdviceAction(adv.id, 'Accepted')}
                        className="px-4 py-1.5 rounded-full text-xs font-black text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all touch-target"
                      >
                        Accept (-{Math.round((1 - adv.maxMultiplier) * 100)}%)
                      </button>
                    </>
                  ) : (
                    <span className="text-[11px] font-bold text-teal-800 bg-white px-3 py-1 rounded-full border border-teal-200">
                      Status: {adv.farmerAction}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MANDATORY FOOTER */}
      <footer className="pt-6 text-center">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
          {DISCLAIMER_NOTE}
        </p>
      </footer>

      {/* MODALS */}
      <FullTimetableModal
        isOpen={showTimetable}
        onClose={() => setShowTimetable(false)}
        onSelectMealForFeeding={(meal) => {
          setShowTimetable(false);
          onStartFeeding(meal);
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
