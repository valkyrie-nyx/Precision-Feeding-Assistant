// src/components/AppHeader.tsx
import React, { useRef, useState } from 'react';
import { Waves, Sliders, CalendarCheck } from 'lucide-react';
import { aquacultureService } from '../services/aquacultureService';

interface AppHeaderProps {
  onOpenDemoPanel: () => void;
  onOpenCheckin?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onOpenDemoPanel, onOpenCheckin }) => {
  const farmSetup = aquacultureService.getFarmSetup();

  // Triple-tap detection
  const tapTimesRef = useRef<number[]>([]);
  const [hintText, setHintText] = useState<string | null>(null);

  const handleTitleClick = () => {
    const now = Date.now();
    // Keep taps from the last 800ms
    tapTimesRef.current = [...tapTimesRef.current.filter((t) => now - t < 800), now];

    if (tapTimesRef.current.length >= 3) {
      tapTimesRef.current = [];
      setHintText('Demo sandbox unlocked!');
      setTimeout(() => setHintText(null), 2000);
      onOpenDemoPanel();
    } else if (tapTimesRef.current.length === 2) {
      setHintText('Tap once more for demo panel');
      setTimeout(() => setHintText(null), 1200);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200/90 shadow-sm px-4 py-3">
      <div className="flex items-center justify-between">
        {/* APP TITLE & TRIPLE-TAP TRIGGER */}
        <div
          onClick={handleTitleClick}
          className="flex items-center gap-3 cursor-pointer select-none group"
          title="Triple-tap title to open Demo Sandbox"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-sky-600 text-white flex items-center justify-center shadow-md ring-offset-pill group-active:scale-95 transition-transform">
            <Waves className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-black text-slate-900 tracking-tight leading-none group-hover:text-teal-700 transition-colors">
                Precision Feeding
              </h1>
              <span className="text-[9px] font-extrabold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded-full border border-teal-200">
                PRO
              </span>
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 block mt-0.5">
              {farmSetup.pondName || 'Sangli Pilot'} · Live Telemetry
            </span>
          </div>
        </div>

        {/* QUICK ACTIONS: DEMO BUTTON & TELEMETRY INDICATOR */}
        <div className="flex items-center gap-2">
          {onOpenCheckin && (
            <button
              onClick={onOpenCheckin}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all touch-target"
              title="Daily Check-in"
              aria-label="Daily Check-in"
            >
              <CalendarCheck className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onOpenDemoPanel}
            className="w-9 h-9 rounded-full bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 flex items-center justify-center shadow-sm transition-all touch-target"
            title="Open Demo Panel"
            aria-label="Demo Panel"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TRIPLE-TAP HINT POPUP */}
      {hintText && (
        <div className="mt-2 text-center text-[10px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 rounded-full py-1 animate-in fade-in duration-150">
          {hintText}
        </div>
      )}
    </header>
  );
};
