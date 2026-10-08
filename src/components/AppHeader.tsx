// src/components/AppHeader.tsx
import React from 'react';
import { Waves, Bell, X } from 'lucide-react';
import { aquacultureService } from '../services/aquacultureService';

export const AppHeader: React.FC = () => {
  const demoState = aquacultureService.getDemoState();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md">
            <Waves className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">
              Precision Feeding Assistant
            </h1>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700">
              Pond Side Support • Live Telemetry Mode
            </span>
          </div>
        </div>
      </div>

      {/* FEEDING ALERT BANNER */}
      {demoState.activeDemoAlertBanner && (
        <div className="mt-3 bg-sky-600 text-white p-3.5 rounded-2xl flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-200 border-2 border-sky-400">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 stroke-[2.5] text-amber-300 animate-bounce shrink-0" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-white">
                Live System Alert
              </span>
              <p className="text-xs font-black text-white mt-0.5 leading-snug">
                {demoState.activeDemoAlertBanner}
              </p>
            </div>
          </div>

          <button
            onClick={() => aquacultureService.dismissDemoBanner()}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
};
