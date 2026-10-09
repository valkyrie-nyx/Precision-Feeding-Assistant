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
import { WaterQualityView } from './views/WaterQualityView';
import { FeedInventoryView } from './views/FeedInventoryView';
import { AnalyticsView } from './views/AnalyticsView';

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

          {activeTab === 'water' && <WaterQualityView />}

          {activeTab === 'inventory' && <FeedInventoryView />}

          {activeTab === 'analytics' && <AnalyticsView />}
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
