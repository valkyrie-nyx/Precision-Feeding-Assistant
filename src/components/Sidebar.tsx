// src/components/Sidebar.tsx
import React from 'react';
import {
  LayoutDashboard,
  Droplets,
  Fish,
  TrendingUp,
  Package,
  Bell,
  Settings,
  Cpu,
  Sliders,
  CalendarCheck,
  RotateCcw,
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

interface SidebarProps {
  activeTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
  pendingMealsCount: number;
  onOpenDemoPanel: () => void;
  onOpenCheckin: () => void;
  onResetSetup: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  pendingMealsCount,
  onOpenDemoPanel,
  onOpenCheckin,
  onResetSetup,
}) => {
  const farmSetup = aquacultureService.getFarmSetup();
  const telemetry = aquacultureService.getTelemetry();
  const alerts = aquacultureService.getActiveAlerts();

  const isLowDO = telemetry.liveDO < 3.0;

  const navItems = [
    {
      id: 'today' as MainTabType,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'water' as MainTabType,
      label: 'Water Quality',
      icon: Droplets,
      badge: isLowDO ? 'ALERT' : null,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'meals' as MainTabType,
      label: 'Feeding',
      icon: Fish,
      badge: pendingMealsCount > 0 ? `${pendingMealsCount}` : null,
      badgeColor: 'bg-[#08B9E8] text-white',
    },
    {
      id: 'analytics' as MainTabType,
      label: 'Fish Growth',
      icon: TrendingUp,
      badge: null,
    },
    {
      id: 'inventory' as MainTabType,
      label: 'Feed Inventory',
      icon: Package,
      badge: null,
    },
    {
      id: 'alerts' as MainTabType,
      label: 'Alerts',
      icon: Bell,
      badge: alerts.length > 0 ? `${alerts.length}` : null,
      badgeColor: 'bg-amber-400 text-slate-900',
    },
    {
      id: 'settings' as MainTabType,
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="relative w-64 bg-gradient-to-b from-[#0789F9] via-[#067ee3] to-[#056ec9] text-white flex flex-col justify-between shrink-0 min-h-screen select-none shadow-xl z-20">
      {/* ORGANIC WAVE RIGHT EDGE DECORATION (Desktop only) */}
      <div className="absolute top-0 right-0 bottom-0 w-4 pointer-events-none overflow-hidden translate-x-full hidden lg:block">
        <svg
          viewBox="0 0 16 1000"
          preserveAspectRatio="none"
          className="h-full w-4 text-[#0789F9]"
          fill="currentColor"
        >
          <path d="M0,0 C8,150 16,300 6,500 C-2,700 12,850 0,1000 L0,1000 L0,0 Z" />
        </svg>
      </div>

      <div className="p-5 relative z-10">
        {/* BRAND LOGO WITH WHITE WATER WAVE */}
        <div className="pb-6 border-b border-white/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center shadow-inner">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 text-white stroke-[2.2]"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-xl tracking-tight text-white font-sans drop-shadow-xs">
                  JalDrishti
                </h1>
                <span className="text-[10px] uppercase font-bold bg-white/20 text-white px-1.5 py-0.5 rounded-full border border-white/30">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-white/80 font-medium tracking-wide">
                Precision Feeding Assistant
              </p>
            </div>
          </div>
        </div>

        {/* ACTIVE POND CHIP */}
        <div className="mt-4 mb-4 bg-white/10 hover:bg-white/15 transition-colors border border-white/20 rounded-xl p-3 backdrop-blur-2xs">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/70 text-[10px] font-semibold uppercase tracking-wider">
              Active Pond Unit
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-white font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </span>
          </div>
          <div className="font-bold text-sm text-white mt-0.5 truncate">
            {farmSetup.pondName} · {farmSetup.farmName}
          </div>
          <div className="text-[11px] text-white/75 mt-0.5">
            Species: Nile Tilapia (Fingerling)
          </div>
        </div>

        {/* NAVIGATION ITEMS */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white text-[#0789F9] font-bold shadow-md shadow-black/10'
                    : 'text-white/85 hover:text-white hover:bg-white/15'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#0789F9] stroke-[2.5]' : 'text-white/90'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.badgeColor || 'bg-white/20 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* LOWER SECTION: DECORATIVE FISH & ESP32 STATUS */}
      <div className="p-5 relative z-10 space-y-4">
        {/* SUBTLE DECORATIVE FISH SILHOUETTES */}
        <div className="opacity-35 pointer-events-none flex justify-around px-2">
          <svg className="w-7 h-5 text-white transform -scale-x-100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.85 0 3.58-.5 5.08-1.38L21 22l-1.62-3.92C20.5 16.58 21 14.85 21 13c0-6.08-4.92-11-9-11zm-1 5a1 1 0 110 2 1 1 0 010-2zm-4 7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" opacity="0.3" />
            <path d="M22 12c-3-2-7-3-11-2-2.5.6-4.8 1.8-7 3.5 1.5 2 4 3.5 7 3.5 4.5 0 8.5-2.5 11-5z" />
          </svg>
          <svg className="w-5 h-4 text-white transform translate-y-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 12c-3-2-7-3-11-2-2.5.6-4.8 1.8-7 3.5 1.5 2 4 3.5 7 3.5 4.5 0 8.5-2.5 11-5z" />
          </svg>
          <svg className="w-8 h-5 text-white transform -scale-x-100 translate-y-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 12c-3-2-7-3-11-2-2.5.6-4.8 1.8-7 3.5 1.5 2 4 3.5 7 3.5 4.5 0 8.5-2.5 11-5z" />
          </svg>
        </div>

        {/* ESP32 HARDWARE CONNECTION PANEL */}
        <div className="bg-black/15 border border-white/20 rounded-2xl p-3.5 backdrop-blur-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-white text-[11px]">
              <Cpu className="w-3.5 h-3.5 text-[#08B9E8]" />
              <span>ESP32-S3 Gateway</span>
            </div>
            <span className="flex items-center gap-1 text-[10px] text-emerald-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Connected
            </span>
          </div>

          <div className="text-[10px] text-white/70 space-y-0.5">
            <div className="flex justify-between">
              <span>Bus:</span>
              <span className="text-white font-mono">RS485 Modbus</span>
            </div>
            <div className="flex justify-between">
              <span>Telemetry:</span>
              <span className="text-white font-mono">100ms / 9600 baud</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center gap-1.5">
            <button
              onClick={onOpenDemoPanel}
              className="flex-1 py-1 px-2 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
              title="Open hardware simulator"
            >
              <Sliders className="w-3 h-3 text-[#08B9E8]" />
              <span>Simulator</span>
            </button>
            <button
              onClick={onOpenCheckin}
              className="py-1 px-2 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
              title="Morning mortality & tray check-in"
            >
              <CalendarCheck className="w-3 h-3 text-white" />
            </button>
            <button
              onClick={onResetSetup}
              className="py-1 px-2 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] font-medium flex items-center justify-center transition-colors"
              title="Reset pond setup wizard"
            >
              <RotateCcw className="w-3 h-3 text-white/70" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
