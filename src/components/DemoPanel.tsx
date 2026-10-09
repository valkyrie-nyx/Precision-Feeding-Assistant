// src/components/DemoPanel.tsx
import React from 'react';
import {
  X,
  RotateCcw,
  Flame,
  Snowflake,
  PackageX,
  Droplets,
  Thermometer,
  Clock,
  Cpu,
} from 'lucide-react';
import { aquacultureService } from '../services/aquacultureService';

interface DemoPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoPanel: React.FC<DemoPanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const telemetry = aquacultureService.getTelemetry();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl border border-slate-300 flex flex-col justify-between max-h-[92vh]">
        {/* HEADER */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-[#0f2847] text-white">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-sky-400" />
            <div>
              <h3 className="font-bold text-sm tracking-tight">
                Hardware Telemetry Simulation Console
              </h3>
              <span className="text-[10px] font-mono text-sky-300 block">
                ESP32 Sensor Register Injection & Emergency Scenario Testing
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-5 overflow-y-auto font-mono text-xs">
          {/* DISCLAIMER / STATUS NOTICE */}
          <div className="p-2.5 bg-sky-50 border border-sky-200 rounded text-sky-950 text-[11px] font-sans flex items-center gap-2">
            <span className="status-pip status-pip-caution shrink-0" />
            <span>
              <strong>Emulation Active:</strong> Sliders override real hardware ADC/I2C registers in memory. All calculation engines and interlocks respond in real-time.
            </span>
          </div>

          {/* 1. TELEMETRY SLIDERS */}
          <div className="bg-[#f8faf9] p-4 rounded border border-slate-200 space-y-4">
            <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block font-sans">
              1. Sensor Value Injection
            </span>

            {/* DO Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-600 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-sky-600" />
                  Dissolved Oxygen (DO):
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {telemetry.liveDO.toFixed(1)} mg/L
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="9.0"
                step="0.1"
                value={telemetry.liveDO}
                onChange={(e) => aquacultureService.setLiveDO(parseFloat(e.target.value))}
                className="w-full accent-teal-700 h-1.5 bg-slate-200 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span className="text-rose-600 font-bold">&lt; 3.0 (Stop Gate)</span>
                <span className="text-amber-600">3.0–5.0 (Reduced)</span>
                <span className="text-emerald-600">≥ 5.0 (Normal)</span>
              </div>
            </div>

            {/* Temperature Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-600 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-teal-700" />
                  Water Temperature:
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {telemetry.liveTemp.toFixed(1)} °C
                </span>
              </div>
              <input
                type="range"
                min="15.0"
                max="38.0"
                step="0.5"
                value={telemetry.liveTemp}
                onChange={(e) => aquacultureService.setLiveTemp(parseFloat(e.target.value))}
                className="w-full accent-teal-700 h-1.5 bg-slate-200 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>15°C (Cold)</span>
                <span className="text-teal-800">27–32°C (Optimum)</span>
                <span className="text-rose-600">&gt; 32°C (Heat Stress)</span>
              </div>
            </div>

            {/* Time of Day */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Current Time:
                </span>
                <span className="font-bold text-slate-900">
                  {telemetry.timeOfDay}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {['06:00 AM', '08:30 AM', '01:00 PM', '06:00 PM'].map((t) => (
                  <button
                    key={t}
                    onClick={() => aquacultureService.setTimeOfDay(t)}
                    className={`py-1 px-2 rounded text-[11px] border text-center transition-colors ${
                      telemetry.timeOfDay === t
                        ? 'bg-slate-900 text-white border-slate-900 font-bold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {t.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. SCENARIO PRESETS */}
          <div className="space-y-2">
            <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block font-sans">
              2. One-Tap Scenario Simulation
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => aquacultureService.applyScenarioPreset('oxygen_dropping')}
                className="p-3 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded text-left space-y-1 transition-colors"
              >
                <div className="font-bold text-xs text-rose-950 flex items-center gap-1.5 font-sans">
                  <Droplets className="w-3.5 h-3.5 text-rose-600" />
                  Oxygen Crash
                </div>
                <div className="text-[10px] text-rose-800">
                  DO drops to 2.4 mg/L · STOP Interlock
                </div>
              </button>

              <button
                onClick={() => aquacultureService.applyScenarioPreset('hot_afternoon')}
                className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded text-left space-y-1 transition-colors"
              >
                <div className="font-bold text-xs text-amber-950 flex items-center gap-1.5 font-sans">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  Extreme Heatwave
                </div>
                <div className="text-[10px] text-amber-800">
                  35.0°C · Metabolic thermal cuts
                </div>
              </button>

              <button
                onClick={() => aquacultureService.applyScenarioPreset('cold_morning')}
                className="p-3 bg-sky-50 hover:bg-sky-100 border border-sky-300 rounded text-left space-y-1 transition-colors"
              >
                <div className="font-bold text-xs text-sky-950 flex items-center gap-1.5 font-sans">
                  <Snowflake className="w-3.5 h-3.5 text-sky-600" />
                  Cold Morning
                </div>
                <div className="text-[10px] text-sky-800">
                  18.0°C · Sessions shift to midday
                </div>
              </button>

              <button
                onClick={() => aquacultureService.applyScenarioPreset('stock_low')}
                className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded text-left space-y-1 transition-colors"
              >
                <div className="font-bold text-xs text-amber-950 flex items-center gap-1.5 font-sans">
                  <PackageX className="w-3.5 h-3.5 text-amber-600" />
                  Stock Short Alarm
                </div>
                <div className="text-[10px] text-amber-800">
                  Feed Y &lt; 2 days · Swap matrix triggered
                </div>
              </button>
            </div>
          </div>

          {/* 3. HARD ALERT TRIGGERS */}
          <div className="space-y-2">
            <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block font-sans">
              3. Trigger Hardware Fault Relays
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => aquacultureService.triggerAlertCategory('low_oxygen')}
                className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-800 text-[11px] font-semibold"
              >
                Trip Low DO
              </button>
              <button
                onClick={() => aquacultureService.triggerAlertCategory('water_change')}
                className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-800 text-[11px] font-semibold"
              >
                Trip Turbidity
              </button>
              <button
                onClick={() => aquacultureService.triggerAlertCategory('extreme_condition')}
                className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-800 text-[11px] font-semibold"
              >
                Trip Overheat
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-slate-200 bg-[#f8faf9] flex items-center justify-between">
          <button
            onClick={() => aquacultureService.resetDemo()}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Pilot Baseline</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-medium"
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
};
