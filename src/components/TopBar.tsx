// src/components/TopBar.tsx
import React, { useState } from 'react';
import {
  ChevronDown,
  Clock,
  Sliders,
  CalendarCheck,
  Settings,
  User,
  ShieldCheck,
} from 'lucide-react';
import { aquacultureService } from '../services/aquacultureService';

interface TopBarProps {
  onOpenDemoPanel: () => void;
  onOpenCheckin: () => void;
  onNavigateSettings?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenDemoPanel,
  onOpenCheckin,
  onNavigateSettings,
}) => {
  const farmSetup = aquacultureService.getFarmSetup();
  const [isPondDropdownOpen, setIsPondDropdownOpen] = useState(false);

  // Available ponds in farm for selector
  const pondOptions = [
    { id: 'pond-a1', name: 'Pond A1', farm: farmSetup.farmName, active: true },
    { id: 'pond-a2', name: 'Pond A2 (Growout)', farm: farmSetup.farmName, active: false },
    { id: 'pond-b1', name: 'Pond B1 (Nursery)', farm: farmSetup.farmName, active: false },
  ];

  const currentTimeText = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-[#e2eef9] px-4 sm:px-8 py-3 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
      {/* LEFT: POND SELECTOR WITH DROPDOWN */}
      <div className="relative">
        <button
          onClick={() => setIsPondDropdownOpen(!isPondDropdownOpen)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#f0f7fe] hover:bg-[#e4f1fc] text-[#12365F] transition-all border border-[#d6e8f7] group"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#0789F9]" />
          <div className="text-left">
            <span className="font-bold text-sm block leading-tight text-[#12365F]">
              {farmSetup.pondName} — {farmSetup.farmName}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-[#0789F9] group-hover:translate-y-0.5 transition-transform" />
        </button>

        {isPondDropdownOpen && (
          <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#d6e8f7] p-2 z-50">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#0789F9] px-3 py-1">
              Select Aquaculture Unit
            </div>
            {pondOptions.map((p) => (
              <button
                key={p.id}
                onClick={() => setIsPondDropdownOpen(false)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                  p.active
                    ? 'bg-[#f0f7fe] text-[#0789F9] font-bold'
                    : 'text-[#12365F] hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-[10px] text-slate-400">{p.farm}</div>
                </div>
                {p.active && <ShieldCheck className="w-4 h-4 text-[#0789F9]" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CENTER / RIGHT TELEMETRY STATUS RIBBON */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* TIMESTAMP */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-[#547392]">
          <Clock className="w-3.5 h-3.5 text-[#0789F9]" />
          <span>Updated {currentTimeText}</span>
        </div>

        {/* LIVE DATA / ESP32 ONLINE INDICATOR PILL */}
        <div className="flex items-center gap-2 bg-[#ecfdf5] border border-emerald-200 px-3 py-1.5 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-emerald-800">
            Live Data / ESP32 Online
          </span>
        </div>

        {/* QUICK HARDWARE SIMULATOR TRIGGER */}
        <button
          onClick={onOpenDemoPanel}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f0f7fe] hover:bg-[#e4f1fc] text-[#0789F9] text-xs font-semibold border border-[#d6e8f7] transition-colors"
          title="Simulate probe values (DO drop, hot water)"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Simulate</span>
        </button>

        {/* MORNING CHECKIN BUTTON */}
        <button
          onClick={onOpenCheckin}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0789F9] hover:bg-[#0574d6] text-white text-xs font-semibold shadow-xs shadow-[#0789F9]/20 transition-all"
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Daily Check-in</span>
        </button>

        {/* PROFILE & SETTINGS ACTIONS */}
        <div className="flex items-center gap-1 pl-1 border-l border-slate-200">
          <button
            onClick={onNavigateSettings}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-[#547392] hover:text-[#12365F] flex items-center justify-center transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0789F9] to-[#08B9E8] text-white flex items-center justify-center shadow-xs">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};
