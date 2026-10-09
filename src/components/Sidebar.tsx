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
    <aside className="relative w-64 bg-gradient-to-b from-[#054b94] via-[#0789F9] to-[#08B9E8] text-white flex flex-col justify-between shrink-0 min-h-screen select-none shadow-xl z-20">
      {/* ============================================================== */}
      {/* FLOWING WAVY RIGHT EDGE + SECOND SEMI-TRANSPARENT WAVE BEHIND */}
      {/* ============================================================== */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 bottom-0 w-6 pointer-events-none overflow-hidden translate-x-full hidden lg:block z-10"
      >
        {/* SECOND SEMI-TRANSPARENT WAVE CURVE (BEHIND) */}
        <svg
          viewBox="0 0 24 1000"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full text-[#08B9E8]/40"
          fill="currentColor"
        >
          <path d="M0,0 C16,120 24,260 10,440 C-4,620 20,780 4,1000 L0,1000 Z" />
        </svg>

        {/* PRIMARY FLOWING WAVY RIGHT EDGE */}
        <svg
          viewBox="0 0 24 1000"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-4 text-[#0789F9]"
          fill="currentColor"
        >
          <path d="M0,0 C12,140 18,300 8,480 C-2,660 14,820 0,1000 L0,1000 Z" />
        </svg>
      </div>

      {/* TOP BRAND & NAV CONTENT */}
      <div className="p-5 relative z-10">
        {/* BRAND LOGO WITH WHITE WATER WAVE */}
        <div className="pb-5 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center shadow-inner">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 text-white stroke-[2.2]"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
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
              <p className="text-[11px] text-white/85 font-medium tracking-wide">
                Precision Feeding Assistant
              </p>
            </div>
          </div>
        </div>

        {/* ACTIVE POND CHIP */}
        <div className="mt-4 mb-4 bg-white/10 hover:bg-white/15 transition-colors border border-white/20 rounded-2xl p-3 backdrop-blur-2xs">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/75 text-[10px] font-semibold uppercase tracking-wider">
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
          <div className="text-[11px] text-white/80 mt-0.5">
            Species: Nile Tilapia (12g Fingerling)
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
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#054b94] font-bold shadow-md shadow-black/10'
                    : 'text-white/90 hover:text-white hover:bg-white/15'
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

      {/* ============================================================== */}
      {/* LOWER SECTION: LAYERED BOTTOM WAVES, FAINT FISH, ESP32 CARD    */}
      {/* ============================================================== */}
      <div className="relative pt-6 pb-5 px-5 z-10 space-y-3 overflow-hidden">
        {/* LAYERED BOTTOM WAVES IN THE SIDEBAR */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-28 pointer-events-none opacity-25 overflow-hidden"
        >
          {/* Back wave */}
          <svg
            viewBox="0 0 300 80"
            preserveAspectRatio="none"
            className="absolute inset-x-0 bottom-0 h-20 w-full text-white"
            fill="currentColor"
          >
            <path d="M0,30 C60,5 120,45 180,20 C240,5 270,35 300,20 L300,80 L0,80 Z" />
          </svg>
          {/* Front wave */}
          <svg
            viewBox="0 0 300 80"
            preserveAspectRatio="none"
            className="absolute inset-x-0 bottom-0 h-14 w-full text-white opacity-40"
            fill="currentColor"
          >
            <path d="M0,40 C70,55 140,25 210,45 C260,35 285,45 300,35 L300,80 L0,80 Z" />
          </svg>
        </div>

        {/* FAINT FISH SILHOUETTES NEAR BOTTOM */}
        <div
          aria-hidden="true"
          className="relative opacity-40 pointer-events-none flex justify-around px-2 z-10"
        >
          <svg
            className="w-6 h-4 text-white transform -scale-x-100"
            viewBox="0 0 36 20"
            fill="currentColor"
          >
            <path d="M34,10 C28,5 18,3 9,7 C5,3 2,1 0,2 C1,5 2,8 1,11 C2,14 1,17 0,20 C2,21 5,19 9,15 C18,19 28,17 34,12 C36,11 36,9 34,10 Z M26,8 C27.1,8 28,7.1 28,6 C26.9,6 26,6.9 26,8 Z" />
          </svg>
          <svg
            className="w-4 h-3 text-white transform -scale-x-100 translate-y-2 opacity-75"
            viewBox="0 0 36 20"
            fill="currentColor"
          >
            <path d="M34,10 C28,5 18,3 9,7 C5,3 2,1 0,2 C1,5 2,8 1,11 C2,14 1,17 0,20 C2,21 5,19 9,15 C18,19 28,17 34,12 C36,11 36,9 34,10 Z" />
          </svg>
          <svg
            className="w-7 h-4.5 text-white transform -scale-x-100 -translate-y-1"
            viewBox="0 0 36 20"
            fill="currentColor"
          >
            <path d="M34,10 C28,5 18,3 9,7 C5,3 2,1 0,2 C1,5 2,8 1,11 C2,14 1,17 0,20 C2,21 5,19 9,15 C18,19 28,17 34,12 C36,11 36,9 34,10 Z M26,8 C27.1,8 28,7.1 28,6 C26.9,6 26,6.9 26,8 Z" />
          </svg>
        </div>

        {/* ESP32 HARDWARE CONNECTION PANEL: DARK TRANSLUCENT ROUNDED CARD */}
        <div className="relative z-20 bg-slate-950/30 border border-white/20 rounded-2xl p-3.5 backdrop-blur-md space-y-2 shadow-lg shadow-black/10">
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

          <div className="text-[10px] text-white/75 space-y-0.5">
            <div className="flex justify-between">
              <span>Bus:</span>
              <span className="text-white font-mono">RS485 Modbus</span>
            </div>
            <div className="flex justify-between">
              <span>Telemetry:</span>
              <span className="text-white font-mono">100ms / 9600 baud</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/15 flex items-center gap-1.5">
            <button
              onClick={onOpenDemoPanel}
              className="flex-1 py-1 px-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
              title="Open hardware simulator"
            >
              <Sliders className="w-3 h-3 text-[#08B9E8]" />
              <span>Simulator</span>
            </button>
            <button
              onClick={onOpenCheckin}
              className="py-1 px-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
              title="Morning mortality & tray check-in"
            >
              <CalendarCheck className="w-3 h-3 text-white" />
            </button>
            <button
              onClick={onResetSetup}
              className="py-1 px-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-medium flex items-center justify-center transition-colors cursor-pointer"
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
