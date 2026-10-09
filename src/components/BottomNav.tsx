// src/components/BottomNav.tsx
import React from 'react';
import {
  LayoutDashboard,
  Droplets,
  Fish,
  Package,
  TrendingUp,
  Bell,
} from 'lucide-react';
import { aquacultureService } from '../services/aquacultureService';

export type MainTabType =
  | 'today'
  | 'water'
  | 'meals'
  | 'analytics'
  | 'inventory'
  | 'alerts'
  | 'settings';

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
  const alerts = aquacultureService.getActiveAlerts();

  const tabs = [
    { id: 'today' as MainTabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'water' as MainTabType, label: 'Water', icon: Droplets },
    { id: 'meals' as MainTabType, label: 'Feeding', icon: Fish, badge: pendingMealsCount > 0 ? pendingMealsCount : null },
    { id: 'analytics' as MainTabType, label: 'Growth', icon: TrendingUp },
    { id: 'inventory' as MainTabType, label: 'Stock', icon: Package },
    { id: 'alerts' as MainTabType, label: 'Alerts', icon: Bell, badge: alerts.length > 0 ? alerts.length : null },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#dcebfa] shadow-2xl">
      <div className="grid grid-cols-6 h-16 max-w-lg mx-auto px-1">
        {tabs.map((t) => {
          const IconComp = t.icon;
          const isActive = activeTab === t.id;

          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`relative flex flex-col items-center justify-center gap-0.5 transition-all touch-target ${
                isActive
                  ? 'text-[#0789F9] font-bold'
                  : 'text-[#547392] hover:text-[#12365F]'
              }`}
            >
              <div className="relative">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    isActive ? 'bg-[#f0f7fe] text-[#0789F9] shadow-xs' : 'text-[#547392]'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                </div>
                {t.badge && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {t.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
