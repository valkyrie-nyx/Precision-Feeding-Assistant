// src/App.tsx
import { useState, useEffect } from 'react';
import { aquacultureService, type AppMealItem } from './services/aquacultureService';
import { AppHeader } from './components/AppHeader';
import { BottomNav, type MainTabType } from './components/BottomNav';
import { SetupModal } from './components/SetupModal';
import { CheckinModal } from './components/CheckinModal';
import { DemoPanel } from './components/DemoPanel';
import { TodayPlanView } from './views/TodayPlanView';
import { MealLogView } from './views/MealLogView';
import { Droplets, Package, TrendingUp } from 'lucide-react';

export function App() {
  const [isOnboarded, setIsOnboarded] = useState<boolean>(aquacultureService.getIsOnboarded());
  const [activeTab, setActiveTab] = useState<MainTabType>('today');
  const [activeMealIdForLog, setActiveMealIdForLog] = useState<string | undefined>(undefined);
  const [isDemoPanelOpen, setIsDemoPanelOpen] = useState<boolean>(false);
  const [isCheckinOpen, setIsCheckinOpen] = useState<boolean>(false);
  const [, setTick] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = aquacultureService.subscribe(() => {
      setIsOnboarded(aquacultureService.getIsOnboarded());
      setTick((prev) => prev + 1);
    });
    return unsubscribe;
  }, []);

  const meals = aquacultureService.getMeals();
  const pendingMealsCount = meals.filter((m) => m.status === 'Pending').length;

  const handleStartFeeding = (meal?: AppMealItem) => {
    if (meal) {
      setActiveMealIdForLog(meal.id);
    }
    setActiveTab('meals');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-800 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Centered Phone-Sized Container (max-w-md) for Bright Sunlight Pond-side Use */}
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col bg-white shadow-2xl min-h-screen relative overflow-x-hidden">
        {/* FIRST LAUNCH: 4-SCREEN SETUP WIZARD */}
        {!isOnboarded && (
          <SetupModal
            onComplete={(setupData) => {
              aquacultureService.completeSetup(setupData);
              setActiveTab('today');
            }}
          />
        )}

        {/* APP HEADER WITH TRIPLE-TAP DEMO LISTENER */}
        <AppHeader
          onOpenDemoPanel={() => setIsDemoPanelOpen(true)}
          onOpenCheckin={() => setIsCheckinOpen(true)}
        />

        {/* MAIN SCROLLABLE CONTENT AREA */}
        <main className="flex-1 p-4 overflow-y-auto">
          {activeTab === 'today' && (
            <TodayPlanView onStartFeeding={handleStartFeeding} />
          )}

          {activeTab === 'meals' && (
            <MealLogView
              activeMealId={activeMealIdForLog}
              onNavigateToTab={(t) => setActiveTab(t as MainTabType)}
            />
          )}

          {/* MILESTONE 2 PREVIEWS FOR TABS 3, 4, 5 */}
          {activeTab === 'water' && (
            <div className="space-y-5 pb-24 text-center py-10 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center mx-auto shadow-md ring-offset-pill">
                <Droplets className="w-8 h-8 stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 inline-block">
                  Milestone 2 · Coming Soon
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Water Quality & Telemetry
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Continuous multi-parameter probe trends, diurnal oxygen forecasting graph, and automated aerator alerts are staged for Milestone 2.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 text-left space-y-2">
                <span className="text-xs font-black uppercase text-slate-600 block">
                  Current Probe Telemetry
                </span>
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>DO Level:</span>
                  <strong className="text-sky-700">{aquacultureService.getTelemetry().liveDO.toFixed(1)} mg/L</strong>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Water Temp:</span>
                  <strong className="text-teal-700">{aquacultureService.getTelemetry().liveTemp.toFixed(1)} °C</strong>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Turbidity:</span>
                  <strong className="text-slate-800">{aquacultureService.getTelemetry().turbidityNtu} NTU</strong>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('today')}
                className="bg-teal-700 text-white font-bold text-xs px-6 py-3 rounded-full shadow-md touch-target"
              >
                Back to Today's Feeding Plan
              </button>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-5 pb-24 text-center py-10 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-md ring-offset-amber">
                <Package className="w-8 h-8 stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-block">
                  Milestone 2 · Coming Soon
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Feed Inventory & Batch Orders
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Automated reorder triggers, batch tracking, and low-stock substitution matrices are staged for Milestone 2.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 text-left space-y-2.5">
                <span className="text-xs font-black uppercase text-slate-600 block">
                  Simulated Feed Stock
                </span>
                {aquacultureService.getFeedInventory().map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs border-b border-slate-200 pb-1.5">
                    <div>
                      <span className="font-bold text-slate-800 block">{item.codeName} ({item.pelletSizeMm}mm)</span>
                      <span className="text-[10px] text-slate-500">{item.stockOnHandKg} kg on hand</span>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      item.isShortStock ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.daysLeft.toFixed(1)} days left
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setActiveTab('today')}
                className="bg-teal-700 text-white font-bold text-xs px-6 py-3 rounded-full shadow-md touch-target"
              >
                Back to Today's Feeding Plan
              </button>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-5 pb-24 text-center py-10 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center mx-auto shadow-md ring-offset-blue">
                <TrendingUp className="w-8 h-8 stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 inline-block">
                  Milestone 2 · Coming Soon
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Growth Model & FCR Tracking
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Weekly sampling calibration, thermal growth coefficient (TGC) curve fit, and FCR optimization charts are staged for Milestone 2.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 text-left space-y-2">
                <span className="text-xs font-black uppercase text-slate-600 block">
                  Current Projection
                </span>
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Current Fish Weight:</span>
                  <strong className="text-slate-900">{aquacultureService.getFarmSetup().currentWeightG} g</strong>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Estimated Days to Next Stage:</span>
                  <strong className="text-teal-700">{aquacultureService.getDaysToNextStage().daysRangeText}</strong>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Model Status:</span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Placeholder TGC
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('today')}
                className="bg-teal-700 text-white font-bold text-xs px-6 py-3 rounded-full shadow-md touch-target"
              >
                Back to Today's Feeding Plan
              </button>
            </div>
          )}
        </main>

        {/* BOTTOM NAVIGATION (5 TABS) */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          pendingMealsCount={pendingMealsCount}
        />

        {/* HIDDEN DEMO PANEL (REVEALED BY TRIPLE-TAPPING TITLE OR SLIDERS ICON) */}
        <DemoPanel
          isOpen={isDemoPanelOpen}
          onClose={() => setIsDemoPanelOpen(false)}
        />

        {/* MORNING CHECKIN MODAL */}
        <CheckinModal
          isOpen={isCheckinOpen}
          onClose={() => setIsCheckinOpen(false)}
        />
      </div>
    </div>
  );
}

export default App;
