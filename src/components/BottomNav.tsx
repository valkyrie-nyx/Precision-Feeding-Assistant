// src/components/BottomNav.tsx
import React from 'react';
import { Calendar, Utensils, TrendingUp } from 'lucide-react';

export type MainTabType = 'today' | 'meals' | 'progress';

interface BottomNavProps {
  activeTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
  pendingMealsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  pendingMealsCount,
}) => {
  const tabs: { id: MainTabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'today', label: 'Today', icon: Calendar },
    { id: 'meals', label: 'Meals', icon: Utensils },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-slate-200 shadow-2xl max-w-md mx-auto">
      <div className="grid grid-cols-3 h-16">
        {tabs.map((t) => {
          const IconComp = t.icon;
          const isActive = activeTab === t.id;
          const showBadge = t.id === 'meals' && pendingMealsCount > 0;

          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`relative flex flex-col items-center justify-center gap-1 transition-all ${
                isActive
                  ? 'text-sky-600 font-black border-t-4 border-sky-600 -mt-1 bg-sky-50/50'
                  : 'text-slate-500 font-bold hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <IconComp className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
                {showBadge && (
                  <span className="absolute -top-1 -right-2 bg-rose-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {pendingMealsCount}
                  </span>
                )}
              </div>
              <span className="text-xs tracking-tight">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
