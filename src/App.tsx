// src/App.tsx
import { useState, useEffect } from 'react';
import { aquacultureService, type AppMealItem } from './services/aquacultureService';
import { Sidebar, type MainTabType } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { SetupModal } from './components/SetupModal';
import { CheckinModal } from './components/CheckinModal';
import { DemoPanel } from './components/DemoPanel';
import { TodayPlanView } from './views/TodayPlanView';
import { MealLogView } from './views/MealLogView';
import { WaterQualityView } from './views/WaterQualityView';
import { FeedInventoryView } from './views/FeedInventoryView';
import { AnalyticsView } from './views/AnalyticsView';
import { AlertsView } from './views/AlertsView';
import { WaveBackground } from './components/waves/WaveBackground';
import { WaveFooter } from './components/waves/WaveFooter';

export function App() {
  const [isOnboarded, setIsOnboarded] = useState<boolean>(aquacultureService.getIsOnboarded());
  const [activeTab, setActiveTab] = useState<MainTabType>('today');
  const [activeMealIdForLog, setActiveMealIdForLog] = useState<string | undefined>(undefined);
  const [isDemoPanelOpen, setIsDemoPanelOpen] = useState<boolean>(false);
  const [isCheckinOpen, setIsCheckinOpen] = useState<boolean>(false);
  const [isSetupOpen, setIsSetupOpen] = useState<boolean>(false);
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

  const handleResetSetup = () => {
    setIsSetupOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#f8fbfe] text-[#12365F] flex flex-col lg:flex-row font-sans selection:bg-[#0789F9] selection:text-white overflow-x-hidden">
      {/* SUBTLE DRIFTING BACKGROUND WAVE LINES */}
      <WaveBackground />

      {/* POND INITIALIZATION / CONFIGURATION MODAL */}
      {(!isOnboarded || isSetupOpen) && (
        <SetupModal
          onComplete={(setupData) => {
            aquacultureService.completeSetup(setupData);
            setIsSetupOpen(false);
            setActiveTab('today');
          }}
        />
      )}

      {/* LEFT SIDEBAR (Desktop Ocean-Blue Sidebar with Wave Edge) */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar
          activeTab={activeTab}
          onTabChange={(t) => {
            if (t === 'settings') {
              setIsSetupOpen(true);
            } else {
              setActiveTab(t);
            }
          }}
          pendingMealsCount={pendingMealsCount}
          onOpenDemoPanel={() => setIsDemoPanelOpen(true)}
          onOpenCheckin={() => setIsCheckinOpen(true)}
          onResetSetup={handleResetSetup}
        />
      </div>

      {/* MAIN APPLICATION WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP BAR WITH POND SELECTOR & LIVE STATUS */}
        <TopBar
          onOpenDemoPanel={() => setIsDemoPanelOpen(true)}
          onOpenCheckin={() => setIsCheckinOpen(true)}
          onNavigateSettings={() => setIsSetupOpen(true)}
        />

        {/* MAIN CONTENT VIEW CANVAS */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
          {activeTab === 'today' && (
            <TodayPlanView
              onStartFeeding={handleStartFeeding}
              onNavigateToTab={(t) => setActiveTab(t as MainTabType)}
            />
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

          {activeTab === 'alerts' && (
            <AlertsView onNavigateToTab={(t) => setActiveTab(t as MainTabType)} />
          )}

          {/* LAYERED WAVE FOOTER WITH BOTTOM-LEFT FISH SILHOUETTES */}
          <WaveFooter />
        </main>

        {/* MOBILE BOTTOM NAVIGATION BAR (< lg viewports only) */}
        <div className="lg:hidden">
          <BottomNav
            activeTab={activeTab}
            onTabChange={(t) => {
              if (t === 'settings') {
                setIsSetupOpen(true);
              } else {
                setActiveTab(t);
              }
            }}
            pendingMealsCount={pendingMealsCount}
          />
        </div>
      </div>

      {/* TELEMETRY SIMULATION CONSOLE MODAL */}
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
  );
}

export default App;
