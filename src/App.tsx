// src/App.tsx
import { useState, useEffect } from 'react';
import { aquacultureService } from './services/aquacultureService';
import { AppHeader } from './components/AppHeader';
import { BottomNav, type MainTabType } from './components/BottomNav';
import { DemoControlBar } from './components/DemoControlBar';
import { OnboardingFlow } from './components/OnboardingFlow';
import { TodayView } from './views/TodayView';
import { FeedView } from './views/FeedView';
import { ProgressView } from './views/ProgressView';

export function App() {
  const [isOnboarded, setIsOnboarded] = useState<boolean>(aquacultureService.getIsOnboarded());
  const [activeTab, setActiveTab] = useState<MainTabType>('today');
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

  if (!isOnboarded) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-2">
        <OnboardingFlow onComplete={() => setActiveTab('today')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Centered Phone-Sized Container (max-w-md) */}
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col bg-white border-x border-slate-200 shadow-2xl min-h-screen relative">
        {/* App Header */}
        <AppHeader />

        {/* Scrollable View Area */}
        <main className="flex-1 p-4 overflow-y-auto pb-24">
          {/* Presentation Demo Controls */}
          <DemoControlBar />

          {activeTab === 'today' && (
            <TodayView onNavigateToMeals={() => setActiveTab('meals')} />
          )}

          {activeTab === 'meals' && <FeedView />}

          {activeTab === 'progress' && <ProgressView />}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          pendingMealsCount={pendingMealsCount}
        />
      </div>
    </div>
  );
}

export default App;
